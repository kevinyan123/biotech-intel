// Shared SEC EDGAR utilities used by /api/sec and /api/insider routes

export const SEC_UA = "KBY-Biotech-Index admin@kby-holdings.com";

// In-memory cache for ticker→CIK map (persists across warm requests)
let tickerMap: Record<string, number> | null = null;
// Cache individual company submissions for 1 hour
const subsCache = new Map<number, { data: any; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getTickerMap(): Promise<Record<string, number>> {
  if (tickerMap) return tickerMap;
  const res = await fetch("https://www.sec.gov/files/company_tickers.json", {
    headers: { "User-Agent": SEC_UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`SEC ticker map: ${res.status}`);
  const data = await res.json();
  const map: Record<string, number> = {};
  for (const e of Object.values(data) as any[]) {
    if (e.ticker) map[e.ticker.toUpperCase()] = e.cik_str;
  }
  tickerMap = map;
  return map;
}

export async function getSubmissions(cik: number) {
  const cached = subsCache.get(cik);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const padded = String(cik).padStart(10, "0");
  const res = await fetch(`https://data.sec.gov/submissions/CIK${padded}.json`, {
    headers: { "User-Agent": SEC_UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`SEC submissions: ${res.status}`);
  const data = await res.json();
  subsCache.set(cik, { data, ts: Date.now() });
  return data;
}
