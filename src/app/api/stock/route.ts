import { NextRequest, NextResponse } from "next/server";

// In-memory cache: ticker → { data, timestamp }
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")?.trim().toUpperCase();
  if (!ticker) return NextResponse.json({ error: "Missing ?ticker=" }, { status: 400 });

  // Check cache
  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Yahoo Finance chart API — 2 years of daily data
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=2y&interval=1d&includePrePost=false`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      // Try alternate endpoint
      const altUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=2y&interval=1d&includePrePost=false`;
      const altRes = await fetch(altUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!altRes.ok) {
        return NextResponse.json({ prices: [], found: false, error: `Yahoo Finance: ${res.status}` });
      }
      const altData = await altRes.json();
      return processYahooResponse(altData, ticker);
    }

    const data = await res.json();
    return processYahooResponse(data, ticker);
  } catch (err: any) {
    console.error("Stock API error:", err?.message);
    return NextResponse.json({ prices: [], found: false, error: err?.message });
  }
}

function processYahooResponse(data: any, ticker: string) {
  const result = data?.chart?.result?.[0];
  if (!result || !result.timestamp) {
    return NextResponse.json({ prices: [], found: false });
  }

  const timestamps: number[] = result.timestamp;
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];
  const volumes: (number | null)[] = result.indicators?.quote?.[0]?.volume || [];
  const currency = result.meta?.currency || "USD";
  const name = result.meta?.shortName || result.meta?.longName || ticker;
  const currentPrice = result.meta?.regularMarketPrice || null;

  // Build daily price array
  const prices: { date: string; price: number; volume: number }[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (close === null || close === undefined) continue;

    const d = new Date(timestamps[i] * 1000);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    prices.push({
      date: dateStr,
      price: Math.round(close * 100) / 100,
      volume: volumes[i] || 0,
    });
  }

  const response = {
    prices,
    found: true,
    ticker,
    name,
    currency,
    currentPrice,
  };

  // Cache the result
  cache.set(ticker, { data: response, ts: Date.now() });

  return NextResponse.json(response);
}
