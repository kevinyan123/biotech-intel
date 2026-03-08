import { NextRequest, NextResponse } from "next/server";
import { getTickerMap, getSubmissions } from "@/lib/api/sec-shared";

// ── Interfaces ──

interface IdentityResult {
  ticker: string;
  cik: number | null;
  secCompanyName: string | null;
  validated: boolean;
  validationMethod: "exact" | "fuzzy" | "unvalidated" | "not_found";
  confidence: number; // 0-1
}

// ── Cache ──

const identityCache = new Map<string, { data: IdentityResult; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ── Name normalization & similarity ──

const STRIP_SUFFIXES =
  /\s*(inc\.?|corp\.?|corporation|ltd\.?|limited|plc|sa|ag|se|nv|co\.?|company|& co\.?|therapeutics|pharmaceutical[s]?|pharma|biosciences|biotherapeutics|biotech|biopharma|biologics|sciences|healthcare|health|medical|medicine[s]?|group|holdings|international|global)\s*/gi;

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(STRIP_SUFFIXES, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trigramSet(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i <= s.length - 3; i++) set.add(s.slice(i, i + 3));
  return set;
}

function nameSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);

  // Exact match after normalization
  if (na === nb) return 1.0;

  // One is a prefix of the other (e.g., "Eli Lilly" vs "Eli Lilly and Company")
  if (na.startsWith(nb) || nb.startsWith(na)) return 0.9;

  // Trigram Jaccard similarity
  const ta = trigramSet(na);
  const tb = trigramSet(nb);
  if (ta.size === 0 || tb.size === 0) return 0;
  let intersection = 0;
  for (const t of ta) if (tb.has(t)) intersection++;
  const union = ta.size + tb.size - intersection;
  return union > 0 ? intersection / union : 0;
}

// ── GET handler ──

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")?.trim().toUpperCase();
  const companyName = req.nextUrl.searchParams.get("company")?.trim();

  if (!ticker) {
    return NextResponse.json({ error: "Missing ?ticker=" }, { status: 400 });
  }

  // Check cache
  const cacheKey = `${ticker}|${companyName || ""}`;
  const cached = identityCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const map = await getTickerMap();
    const cik = map[ticker];

    if (!cik) {
      const result: IdentityResult = {
        ticker,
        cik: null,
        secCompanyName: null,
        validated: false,
        validationMethod: "not_found",
        confidence: 0,
      };
      identityCache.set(cacheKey, { data: result, ts: Date.now() });
      return NextResponse.json(result);
    }

    // Fetch SEC submissions to get the registered company name for this CIK
    const sub = await getSubmissions(cik);
    const secName: string | null = sub?.name || null;

    let validated = false;
    let validationMethod: IdentityResult["validationMethod"] = "unvalidated";
    let confidence = 0;

    if (secName && companyName) {
      confidence = nameSimilarity(companyName, secName);
      if (confidence >= 0.6) {
        validated = true;
        validationMethod = confidence >= 0.95 ? "exact" : "fuzzy";
      } else {
        validated = false;
        validationMethod = "unvalidated";
      }
    } else if (secName && !companyName) {
      // No company name to validate against — treat as unvalidated
      validated = false;
      validationMethod = "unvalidated";
      confidence = 0;
    }

    const result: IdentityResult = {
      ticker,
      cik,
      secCompanyName: secName,
      validated,
      validationMethod,
      confidence,
    };

    identityCache.set(cacheKey, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Identity API error:", err?.message);
    return NextResponse.json({
      ticker,
      cik: null,
      secCompanyName: null,
      validated: false,
      validationMethod: "not_found",
      confidence: 0,
      error: err?.message,
    } as IdentityResult);
  }
}
