"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, ReferenceDot, CartesianGrid,
} from "recharts";
import { chartMarkerCategory, relativeTime } from "@/lib/catalyst-utils";

interface Catalyst { id: string; date: string; type: string; drugId: string; drugName: string | null; companyId: string; companyName: string; indication: string; readoutConfidence?: "confirmed" | "estimated"; readoutSource?: string | null; }

interface Props {
  companyId: string;
  ticker: string;
  marketCap: number;
  catalysts: Catalyst[];
}

/* ── helpers ─────────────────────────────────────────────────────── */
const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const toTs = (d: string) => new Date(d + "T00:00:00").getTime();
const fmtAxis = (ts: number) => { const d = new Date(ts); return `${MO[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`; };
const fmtFull = (ts: number) => { const d = new Date(ts); return `${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };

const DATA_READOUT_COLOR = "#64b5f6";

/**
 * Linearly interpolate (or snap) the price at `target` using a sorted
 * array of {ts,price} candles.  If the target falls on a non-trading day
 * the price is interpolated between the two surrounding candles.
 */
function interpolatePrice(
  target: number,
  data: { ts: number; price: number }[],
): number | null {
  if (data.length === 0) return null;
  if (target <= data[0].ts) return data[0].price;
  if (target >= data[data.length - 1].ts) return data[data.length - 1].price;

  let lo = 0, hi = data.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (data[mid].ts < target) lo = mid + 1; else hi = mid;
  }
  if (data[lo].ts === target) return data[lo].price;

  const before = data[lo - 1];
  const after  = data[lo];
  const t = (target - before.ts) / (after.ts - before.ts);
  return Math.round((before.price + t * (after.price - before.price)) * 100) / 100;
}

/* ── marker type ─────────────────────────────────────────────────── */
interface MarkerDatum {
  id: string;
  date: string;
  type: string;
  drugName: string | null;
  indication: string;
  ts: number;
  price: number;
  clusterY: number;
}

/* ── cluster nudge ───────────────────────────────────────────────── */
const MARKER_PX_R = 8;
function clusterMarkers(
  markers: MarkerDatum[],
  priceRange: number,
  chartHeightPx: number,
): MarkerDatum[] {
  if (markers.length <= 1) return markers;
  const pxPerDollar = chartHeightPx / (priceRange || 1);
  const minGapDollars = (MARKER_PX_R * 2.5) / pxPerDollar;

  const DAY7 = 7 * 86400000;
  const groups: MarkerDatum[][] = [];
  let cur: MarkerDatum[] = [markers[0]];
  for (let i = 1; i < markers.length; i++) {
    if (markers[i].ts - cur[cur.length - 1].ts < DAY7) {
      cur.push(markers[i]);
    } else {
      groups.push(cur);
      cur = [markers[i]];
    }
  }
  groups.push(cur);

  for (const g of groups) {
    if (g.length <= 1) continue;
    g.sort((a, b) => a.price - b.price);
    g[0].clusterY = g[0].price;
    for (let i = 1; i < g.length; i++) {
      const needed = g[i - 1].clusterY + minGapDollars;
      g[i].clusterY = Math.max(g[i].price, needed);
    }
  }

  return markers;
}

/* ── component ───────────────────────────────────────────────────── */
export default function StockChart({ companyId, ticker, marketCap, catalysts }: Props) {
  const [timeRange, setTimeRange] = useState<"6M"|"1Y"|"2Y">("1Y");

  const [allData, setAllData] = useState<{ ts: number; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockName, setStockName] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}`)
      .then(r => r.json())
      .then(data => {
        if (!data.found || !data.prices?.length) {
          setError(`No stock data found for ${ticker}`);
          setAllData([]);
        } else {
          setAllData(data.prices.map((p: any) => ({ ts: toTs(p.date), price: p.price })));
          setStockName(data.name || null);
          setCurrentPrice(data.currentPrice || null);
        }
      })
      .catch(() => { setError("Failed to fetch stock data"); setAllData([]); })
      .finally(() => setLoading(false));
  }, [ticker]);

  /* historical data for the selected range */
  const historicalData = useMemo(() => {
    const now = Date.now();
    let cutoff: number;
    if (timeRange === "6M") cutoff = now - 6 * 30 * 86400000;
    else if (timeRange === "1Y") cutoff = now - 365 * 86400000;
    else cutoff = now - 2 * 365 * 86400000;
    return allData.filter(d => d.ts >= cutoff);
  }, [allData, timeRange]);

  const lastTs = useMemo(() => allData.length ? allData[allData.length - 1].ts : Date.now(), [allData]);

  const priceChange = useMemo(() => {
    if (historicalData.length < 2) return null;
    const first = historicalData[0].price;
    const last = historicalData[historicalData.length - 1].price;
    const change = last - first;
    const pct = (change / first) * 100;
    return { change, pct, isUp: change >= 0 };
  }, [historicalData]);

  /* ── chart data: only historical prices, no future stubs ── */
  const chartData = useMemo(() => {
    if (historicalData.length === 0) return [];
    return historicalData.map(d => ({ ts: d.ts, price: d.price }));
  }, [historicalData]);

  /* ── build markers: only past Data Readout catalysts ── */
  const chartMarkers = useMemo(() => {
    if (historicalData.length === 0) return [];
    const chartStart = historicalData[0].ts;
    const priceRange = Math.max(...historicalData.map(d => d.price)) - Math.min(...historicalData.map(d => d.price));

    const raw: MarkerDatum[] = [];

    for (const c of catalysts) {
      // Only include Data Readout category
      if (chartMarkerCategory(c.type) !== "results") continue;

      const cts = toTs(c.date);

      // Only past catalysts (on or before last trading day)
      if (cts > lastTs) continue;

      // Must be within visible chart range
      if (cts < chartStart) continue;

      const price = interpolatePrice(cts, allData);
      if (price === null) continue;

      raw.push({
        id: c.id,
        date: c.date,
        type: c.type,
        drugName: c.drugName,
        indication: c.indication,
        ts: cts,
        price,
        clusterY: price,
      });
    }

    raw.sort((a, b) => a.ts - b.ts);
    return clusterMarkers(raw, priceRange, 300);
  }, [catalysts, historicalData, allData, lastTs]);

  /* ── tooltip ── */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const ts = item.ts as number;
    const price = item.price as number | null;
    const dayCats = chartMarkers.filter(c => Math.abs(c.ts - ts) < 86400000);
    return (
      <div style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd2)", borderRadius: 8, padding: "8px 12px", fontSize: 11, maxWidth: 260 }}>
        <div className="font-mono text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>{fmtFull(ts)}</div>
        {price != null && (
          <div className="font-mono font-bold text-[14px]" style={{ color: "var(--color-ac)" }}>${price.toFixed(2)}</div>
        )}
        {dayCats.map((c, i) => {
          const catData = catalysts.find(cat => cat.id === c.id);
          const confColor = catData?.readoutConfidence === "confirmed" ? "#64b5f6" : "#ffab66";
          return (
            <div key={i} className="mt-1.5 pt-1.5" style={{ borderTop: "1px solid var(--color-bd)" }}>
              <div className="flex items-center gap-1.5">
                <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: DATA_READOUT_COLOR }} />
                <span className="text-[9px] font-bold" style={{ color: DATA_READOUT_COLOR }}>{c.type}</span>
                <span className="text-[7px] font-mono px-1 rounded" style={{ background: `${confColor}15`, color: confColor }}>
                  {catData?.readoutConfidence === "confirmed" ? "Confirmed" : "Estimated"}
                </span>
              </div>
              <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--color-t0)" }}>{c.drugName}</div>
              <div className="text-[8px]" style={{ color: "var(--color-t2)" }}>{c.indication}</div>
              <div className="text-[8px] font-mono" style={{ color: DATA_READOUT_COLOR }}>
                {fmtFull(c.ts)} · ${c.price.toFixed(2)} · {relativeTime(c.date)}
              </div>
              {catData?.readoutSource && (
                <div className="text-[7px] font-mono mt-0.5" style={{ color: "var(--color-t2)" }}>
                  Source: {catData.readoutSource}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* ── loading / error ── */
  if (loading) {
    return (
      <div style={{ height: 300 }} className="flex items-center justify-center">
        <div className="text-xs animate-pulse" style={{ color: "var(--color-t2)" }}>Loading {ticker} stock data...</div>
      </div>
    );
  }
  if (error || chartData.length === 0) {
    return (
      <div style={{ height: 200 }} className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: "var(--color-t2)" }}>{error || `No price data available for ${ticker}`}</div>
          <div className="text-[10px]" style={{ color: "var(--color-t2)", opacity: 0.6 }}>Stock data is only available for real publicly traded tickers.</div>
        </div>
      </div>
    );
  }

  const realPrices = historicalData.map(d => d.price);
  const minP = Math.min(...realPrices);
  const maxP = Math.max(...realPrices);
  const pad = (maxP - minP) * 0.12 || 1;

  const lineColor = priceChange && priceChange.isUp ? "#00f5b0" : "#ff6b6b";

  return (
    <div>
      {/* Price header */}
      <div className="flex items-baseline gap-2.5 mb-3">
        {currentPrice && (
          <span className="font-mono font-bold text-[20px]" style={{ color: "var(--color-t0)" }}>${currentPrice.toFixed(2)}</span>
        )}
        {priceChange && (
          <span className="font-mono text-[11px] font-semibold" style={{ color: priceChange.isUp ? "#00e676" : "#ff6b6b" }}>
            {priceChange.isUp ? "+" : ""}{priceChange.change.toFixed(2)} ({priceChange.isUp ? "+" : ""}{priceChange.pct.toFixed(1)}%)
            <span className="font-normal ml-1" style={{ color: "var(--color-t2)" }}>{timeRange}</span>
          </span>
        )}
        {stockName && <span className="text-[9px] ml-auto" style={{ color: "var(--color-t2)" }}>{stockName}</span>}
      </div>

      {/* Time range + legend */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex gap-[3px]">
          {(["6M", "1Y", "2Y"] as const).map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all font-mono"
              style={{ background: timeRange === r ? "var(--color-acd)" : "transparent", border: `1px solid ${timeRange === r ? "rgba(0,223,162,0.3)" : "var(--color-bd)"}`, color: timeRange === r ? "var(--color-ac)" : "var(--color-t2)", fontWeight: timeRange === r ? 600 : 400 }}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[9px]" style={{ color: "var(--color-t2)" }}>
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: DATA_READOUT_COLOR }} />
          <span style={{ color: DATA_READOUT_COLOR, fontWeight: 600 }}>Data Readout</span>
          <span className="font-mono opacity-60">· {chartMarkers.length} event{chartMarkers.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`sg-${companyId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" vertical={false} />
            <XAxis
              dataKey="ts" type="number" scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={fmtAxis}
              stroke="#7e92a6" fontSize={8} fontFamily="JetBrains Mono, monospace"
              tickLine={false} axisLine={{ stroke: "#2a3a4e" }}
              tickCount={8}
            />
            <YAxis
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              stroke="#7e92a6" fontSize={8} fontFamily="JetBrains Mono, monospace"
              tickLine={false} axisLine={false}
              domain={[Math.floor(minP - pad), Math.ceil(maxP + pad)]}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#7e92a644", strokeDasharray: "3 3" }} />

            {/* Price line */}
            <Area
              type="monotone" dataKey="price"
              stroke={lineColor} strokeWidth={1.5}
              fill={`url(#sg-${companyId})`}
              dot={false}
              activeDot={{ r: 3, fill: lineColor, stroke: "#161c26", strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Data Readout markers on the price line */}
            {chartMarkers.map((m, i) => (
              <ReferenceDot
                key={`cat-${i}`}
                x={m.ts}
                y={m.clusterY}
                r={6}
                fill={DATA_READOUT_COLOR}
                stroke="#0f1319"
                strokeWidth={2}
                isFront={true}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
        <div className="flex gap-2.5 text-[8px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
          <span className="inline-flex items-center gap-[3px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: DATA_READOUT_COLOR }} />
            Data Readout
          </span>
          <span className="opacity-40">Past clinical trial results (Ph2, Ph3, Interim)</span>
        </div>
        <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
          {ticker} · {chartMarkers.length} readout{chartMarkers.length !== 1 ? "s" : ""} · Yahoo Finance
        </div>
      </div>
    </div>
  );
}
