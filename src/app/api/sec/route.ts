import { NextRequest, NextResponse } from "next/server";
import { getTickerMap, getSubmissions } from "@/lib/api/sec-shared";

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")?.trim().toUpperCase();
  if (!ticker) return NextResponse.json({ error: "Missing ?ticker=" }, { status: 400 });

  try {
    const map = await getTickerMap();
    const cik = map[ticker];
    if (!cik) return NextResponse.json({ filings: [], found: false });

    const sub = await getSubmissions(cik);
    if (!sub?.filings?.recent) return NextResponse.json({ filings: [], found: true });

    const r = sub.filings.recent;
    const wanted = new Set(["10-K", "10-Q", "8-K", "DEF 14A", "DEFA14A", "S-1", "S-1/A", "S-3", "20-F", "6-K"]);
    const filings: {
      type: string;
      title: string;
      date: string;
      url: string;
      accession: string;
    }[] = [];

    for (let i = 0; i < r.form.length && filings.length < 12; i++) {
      if (wanted.has(r.form[i])) {
        const accRaw = r.accessionNumber[i]; // e.g. "0000320193-24-000010"
        const accClean = accRaw.replace(/-/g, ""); // "000032019324000010"
        filings.push({
          type: r.form[i],
          title: r.primaryDocDescription[i] || r.form[i],
          date: r.filingDate[i],
          url: `https://www.sec.gov/Archives/edgar/data/${cik}/${accClean}/${r.primaryDocument[i]}`,
          accession: accRaw,
        });
      }
    }

    return NextResponse.json({
      filings,
      found: true,
      company: sub.name || null,
      cik,
    });
  } catch (err: any) {
    console.error("SEC API error:", err?.message);
    return NextResponse.json({ filings: [], found: false, error: err?.message }, { status: 200 });
  }
}
