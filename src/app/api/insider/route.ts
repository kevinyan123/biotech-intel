import { NextRequest, NextResponse } from "next/server";
import { getTickerMap, SEC_UA } from "@/lib/api/sec-shared";

// ── Interfaces ──

interface InsiderTransaction {
  insiderName: string;
  insiderRole: string;
  date: string;
  type: "Buy" | "Sell";
  shares: number;
  pricePerShare: number;
  totalValue: number;
  filingUrl: string;
}

interface InsiderResponse {
  found: boolean;
  ticker: string;
  transactions: InsiderTransaction[];
  summary: {
    totalBuys: number;
    totalSells: number;
    netActivity: number;
    buyCount: number;
    sellCount: number;
  };
}

// ── Cache ──

const insiderCache = new Map<string, { data: InsiderResponse; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function emptySummary() {
  return { totalBuys: 0, totalSells: 0, netActivity: 0, buyCount: 0, sellCount: 0 };
}

// ── Form 4 XML Parser ──

// Decode common XML entities
function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function parseForm4Xml(
  xml: string,
  filingUrl: string,
): InsiderTransaction[] {
  const transactions: InsiderTransaction[] = [];

  // Extract reporting owner name
  const nameMatch = xml.match(/<rptOwnerName>([^<]+)<\/rptOwnerName>/);
  const insiderName = decodeXmlEntities(nameMatch?.[1]?.trim() || "Unknown");

  // Extract role: prefer officerTitle, fall back to isDirector/isOfficer
  const titleMatch = xml.match(/<officerTitle>([^<]+)<\/officerTitle>/);
  const isDirector = /<isDirector>\s*(?:true|1)\s*<\/isDirector>/i.test(xml);
  const isOfficer = /<isOfficer>\s*(?:true|1)\s*<\/isOfficer>/i.test(xml);
  const isTenPctOwner = /<isTenPercentOwner>\s*(?:true|1)\s*<\/isTenPercentOwner>/i.test(xml);

  let insiderRole = decodeXmlEntities(titleMatch?.[1]?.trim() || "");
  if (!insiderRole) {
    if (isOfficer) insiderRole = "Officer";
    else if (isDirector) insiderRole = "Director";
    else if (isTenPctOwner) insiderRole = "10% Owner";
    else insiderRole = "Insider";
  }

  // Extract each nonDerivativeTransaction block
  const txBlocks =
    xml.match(/<nonDerivativeTransaction>[\s\S]*?<\/nonDerivativeTransaction>/g) || [];

  for (const block of txBlocks) {
    const dateMatch = block.match(/<transactionDate>\s*<value>([^<]+)<\/value>/);
    const codeMatch = block.match(/<transactionCode>([^<]+)<\/transactionCode>/);
    const sharesMatch = block.match(/<transactionShares>\s*<value>([^<]+)<\/value>/);
    const priceMatch = block.match(/<transactionPricePerShare>\s*<value>([^<]*)<\/value>/);

    const txCode = codeMatch?.[1]?.trim();
    // Only include purchases (P) and sales (S); skip gifts, awards, exercises
    if (txCode !== "P" && txCode !== "S") continue;

    const date = dateMatch?.[1]?.trim() || "";
    const shares = parseFloat(sharesMatch?.[1] || "0");
    const price = parseFloat(priceMatch?.[1] || "0");

    if (!date || shares <= 0) continue;

    transactions.push({
      insiderName,
      insiderRole,
      date,
      type: txCode === "P" ? "Buy" : "Sell",
      shares,
      pricePerShare: Math.round(price * 100) / 100,
      totalValue: Math.round(shares * price * 100) / 100,
      filingUrl,
    });
  }

  return transactions;
}

// ── Rate-limited batch fetcher ──

async function fetchWithThrottle<T>(
  items: { url: string; meta: any }[],
  fetchFn: (url: string, meta: any) => Promise<T | null>,
  batchSize = 3,
  delayMs = 250,
): Promise<(T | null)[]> {
  const results: (T | null)[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) => fetchFn(item.url, item.meta).catch(() => null)),
    );
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return results;
}

// ── Discover Form 4 filings via EDGAR Full-Text Search (EFTS) ──

interface EFTSHit {
  _id: string;
  _source: {
    ciks: string[];
    display_names: string[];
    adsh: string;       // accession number with dashes
    file_date: string;  // YYYY-MM-DD
    form: string;
  };
}

async function discoverForm4Filings(
  cik: number,
  limit = 15,
): Promise<{ accession: string; xmlDocId: string; fileDate: string; filerCik: string }[]> {
  const cikPadded = String(cik).padStart(10, "0");

  // Search EDGAR EFTS for Form 4 filings referencing this company CIK
  const url = `https://efts.sec.gov/LATEST/search-index?q=%22${cikPadded}%22&forms=4&dateRange=custom&startdt=2024-01-01&enddt=2027-01-01&from=0&size=${limit}`;

  const res = await fetch(url, {
    headers: { "User-Agent": SEC_UA, Accept: "application/json" },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const hits: EFTSHit[] = data?.hits?.hits || [];

  return hits.map((h) => {
    // _id format: "0001786054-26-000004:wk-form4_1770844753.xml"
    const [accession, xmlDoc] = h._id.split(":");
    // The filer CIK is the first CIK in the ciks array (the insider)
    const filerCik = h._source.ciks[0]?.replace(/^0+/, "") || "";
    return {
      accession,
      xmlDocId: xmlDoc || "",
      fileDate: h._source.file_date,
      filerCik,
    };
  });
}

// ── GET handler ──

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")?.trim().toUpperCase();
  const cikParam = req.nextUrl.searchParams.get("cik");

  if (!ticker && !cikParam) {
    return NextResponse.json({ error: "Missing ?ticker= or ?cik=" }, { status: 400 });
  }

  const cacheKey = ticker || cikParam || "";

  // Check cache
  const cached = insiderCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    let cik: number;
    if (cikParam) {
      // Use pre-validated CIK directly (from /api/identity)
      cik = parseInt(cikParam, 10);
      if (isNaN(cik)) return NextResponse.json({ error: "Invalid cik" }, { status: 400 });
    } else {
      const map = await getTickerMap();
      const resolved = map[ticker!];
      if (!resolved) {
        const result: InsiderResponse = {
          found: false, ticker: ticker || "", transactions: [], summary: emptySummary(),
        };
        insiderCache.set(cacheKey, { data: result, ts: Date.now() });
        return NextResponse.json(result);
      }
      cik = resolved;
    }

    // Discover Form 4 filings via EDGAR EFTS
    const form4s = await discoverForm4Filings(cik, 15);

    if (form4s.length === 0) {
      const result: InsiderResponse = {
        found: true, ticker: ticker || "", transactions: [], summary: emptySummary(),
      };
      insiderCache.set(cacheKey, { data: result, ts: Date.now() });
      return NextResponse.json(result);
    }

    // Build URLs for each Form 4 XML document
    const fetchItems = form4s.map((f) => {
      const accClean = f.accession.replace(/-/g, "");
      const filerCikClean = f.filerCik || String(cik);
      const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${filerCikClean}/${accClean}/${f.xmlDocId}`;
      const filingUrl = `https://www.sec.gov/Archives/edgar/data/${filerCikClean}/${accClean}/${f.accession}-index.htm`;
      return { url: xmlUrl, meta: { filingUrl } };
    });

    // Fetch XMLs with rate limiting (batches of 3, 250ms delay)
    const xmlResults = await fetchWithThrottle(
      fetchItems,
      async (url, meta) => {
        const res = await fetch(url, {
          headers: { "User-Agent": SEC_UA, Accept: "application/xml,text/xml,text/html,*/*" },
        });
        if (!res.ok) return null;
        const text = await res.text();
        return { xml: text, filingUrl: meta.filingUrl as string };
      },
    );

    // Parse all transactions
    let allTransactions: InsiderTransaction[] = [];
    for (const result of xmlResults) {
      if (!result) continue;
      const { xml, filingUrl } = result;
      // Only parse if it looks like Form 4 XML
      if (!xml.includes("ownershipDocument") && !xml.includes("rptOwnerName")) continue;
      const txns = parseForm4Xml(xml, filingUrl);
      allTransactions.push(...txns);
    }

    // Sort by date descending (most recent first)
    allTransactions.sort((a, b) => b.date.localeCompare(a.date));

    // Compute summary
    const buys = allTransactions.filter((t) => t.type === "Buy");
    const sells = allTransactions.filter((t) => t.type === "Sell");
    const totalBuys = buys.reduce((s, t) => s + t.totalValue, 0);
    const totalSells = sells.reduce((s, t) => s + t.totalValue, 0);

    const apiResult: InsiderResponse = {
      found: true,
      ticker: ticker || "",
      transactions: allTransactions,
      summary: {
        totalBuys: Math.round(totalBuys * 100) / 100,
        totalSells: Math.round(totalSells * 100) / 100,
        netActivity: Math.round((totalBuys - totalSells) * 100) / 100,
        buyCount: buys.length,
        sellCount: sells.length,
      },
    };

    insiderCache.set(cacheKey, { data: apiResult, ts: Date.now() });
    return NextResponse.json(apiResult);
  } catch (err: any) {
    console.error("Insider API error:", err?.message);
    return NextResponse.json({
      found: false,
      ticker: ticker || "",
      transactions: [],
      summary: emptySummary(),
      error: err?.message,
    });
  }
}
