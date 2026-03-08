"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, ReferenceDot, ReferenceLine, CartesianGrid,
} from "recharts";
import { chartMarkerColor, chartMarkerCategory, relativeTime, CHART_MARKER_LEGEND } from "@/lib/catalyst-utils";

interface Catalyst { id: string; date: string; type: string; drugId: string; drugName: string | null; companyId: string; companyName: string; indication: string; }

interface Props {
  companyId: string;
  ticker: string;
  marketCap: number;
  catalysts: Catalyst[];
}

const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const toTs = (d: string) => new Date(d + "T00:00:00").getTime();
const toStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmtAxis = (ts: number) => { const d = new Date(ts); return `${MO[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`; };
const fmtFull = (ts: number) => { const d = new Date(ts); return `${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const todayTs = toTs(toStr(new Date()));

export default function StockChart({ companyId, ticker, marketCap, catalysts }: Props) {
  const [timeRange, setTimeRange] = useState<"6M"|"1Y"|"2Y">("1Y");
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set());

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

  // Historical data filtered by time range
  const historicalData = useMemo(() => {
    const now = Date.now();
    let cutoff: number;
    if (timeRange === "6M") cutoff = now - 6 * 30 * 86400000;
    else if (timeRange === "1Y") cutoff = now - 365 * 86400000;
    else cutoff = now - 2 * 365 * 86400000;
    return allData.filter(d => d.ts >= cutoff);
  }, [allData, timeRange]);

  const lastPrice = useMemo(() => {
    if (allData.length === 0) return 0;
    return allData[allData.length - 1].price;
  }, [allData]);

  const lastTs = useMemo(() => {
    if (allData.length === 0) return todayTs;
    return allData[allData.length - 1].ts;
  }, [allData]);

  // Build price lookup: ts → price
  const priceByTs = useMemo(() => {
    const m = new Map<number, number>();
    allData.forEach(d => m.set(d.ts, d.price));
    return m;
  }, [allData]);

  // Sorted timestamps for snapping
  const sortedTs = useMemo(() => allData.map(d => d.ts), [allData]);

  const priceChange = useMemo(() => {
    if (historicalData.length < 2) return null;
    const first = historicalData[0].price;
    const last = historicalData[historicalData.length - 1].price;
    const change = last - first;
    const pct = (change / first) * 100;
    return { change, pct, isUp: change >= 0 };
  }, [historicalData]);

  // Snap to nearest timestamp
  function snapTs(target: number): number | null {
    if (sortedTs.length === 0) return null;
    let lo = 0, hi = sortedTs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sortedTs[mid] < target) lo = mid + 1; else hi = mid;
    }
    if (lo === 0) return sortedTs[0];
    if (lo >= sortedTs.length) return sortedTs[sortedTs.length - 1];
    const before = sortedTs[lo - 1], after = sortedTs[lo];
    return Math.abs(target - before) <= Math.abs(target - after) ? before : after;
  }

  // Filtered catalysts
  const filteredCatalysts = useMemo(() => {
    return catalysts
      .filter(c => !hiddenCats.has(chartMarkerCategory(c.type)))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [catalysts, hiddenCats]);

  // Chart data: real prices as {ts, price} — numeric x-axis
  // Plus future catalyst dates as {ts, price: null} to extend x domain
  const chartData = useMemo(() => {
    if (historicalData.length === 0) return [];
    const data: { ts: number; price: number | null }[] =
      historicalData.map(d => ({ ts: d.ts, price: d.price }));

    // Add future catalyst dates with null price
    const futureDates = new Set<number>();
    filteredCatalysts.forEach(c => {
      const cts = toTs(c.date);
      if (cts > lastTs) futureDates.add(cts);
    });
    for (const fts of [...futureDates].sort()) {
      data.push({ ts: fts, price: null });
    }

    return data;
  }, [historicalData, filteredCatalysts, lastTs]);

  // Build markers
  const chartMarkers = useMemo(() => {
    if (historicalData.length === 0) return [];
    const chartStart = historicalData[0].ts;

    return filteredCatalysts
      .map(c => {
        const cts = toTs(c.date);
        const isFuture = cts > lastTs;

        if (isFuture) {
          return { ...c, markerTs: cts, displayPrice: lastPrice, isFuture: true };
        } else {
          const snapped = snapTs(cts);
          if (snapped === null || snapped < chartStart) return null;
          const price = priceByTs.get(snapped);
          if (price === undefined) return null;
          return { ...c, markerTs: snapped, displayPrice: price, isFuture: false };
        }
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [filteredCatalysts, historicalData, lastTs, lastPrice, priceByTs]);

  // Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const ts = item.ts as number;
    const price = item.price as number | null;
    const isFuture = ts > lastTs;
    const dayCats = chartMarkers.filter(c => c.markerTs === ts);
    return (
      <div style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd2)", borderRadius: 8, padding: "8px 12px", fontSize: 11, maxWidth: 260 }}>
        <div className="font-mono text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>{fmtFull(ts)}</div>
        {!isFuture && price != null && (
          <div className="font-mono font-bold text-[14px]" style={{ color: "var(--color-ac)" }}>${price.toFixed(2)}</div>
        )}
        {dayCats.map((c, i) => (
          <div key={i} className="mt-1.5 pt-1.5" style={{ borderTop: i > 0 || !isFuture ? "1px solid var(--color-bd)" : "none" }}>
            <div className="flex items-center gap-1.5">
              <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: chartMarkerColor(c.type) }} />
              <span className="text-[9px] font-bold" style={{ color: chartMarkerColor(c.type) }}>{c.type}</span>
              {c.isFuture && <span className="text-[7px] font-mono px-1 rounded" style={{ background: "var(--color-b3)", color: "var(--color-t2)" }}>upcoming</span>}
            </div>
            <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--color-t0)" }}>{c.drugName}</div>
            <div className="text-[8px]" style={{ color: "var(--color-t2)" }}>{c.indication}</div>
            <div className="text-[8px] font-mono" style={{ color: chartMarkerColor(c.type) }}>{relativeTime(c.date)}</div>
          </div>
        ))}
      </div>
    );
  };

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
  const pad = (maxP - minP) * 0.1 || 1;

  const toggleCat = (key: string) => {
    setHiddenCats(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  };

  const lineColor = priceChange && priceChange.isUp ? "#00f5b0" : "#ff6b6b";
  const hasFuture = chartMarkers.some(c => c.isFuture);
  const pastCount = chartMarkers.filter(c => !c.isFuture).length;
  const futureCount = chartMarkers.filter(c => c.isFuture).length;

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

      {/* Filters */}
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
        <div className="flex gap-[3px] flex-wrap">
          {CHART_MARKER_LEGEND.map(item => {
            const active = !hiddenCats.has(item.key);
            return (
              <button key={item.key} onClick={() => toggleCat(item.key)}
                className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all inline-flex items-center gap-1"
                style={{ background: active ? `${item.color}15` : "transparent", border: `1px solid ${active ? `${item.color}44` : "var(--color-bd)"}`, color: active ? item.color : "var(--color-t2)", fontWeight: active ? 600 : 400, opacity: active ? 1 : 0.5 }}>
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: active ? item.color : "var(--color-t2)" }} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart — numeric time x-axis for proportional date spacing */}
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
              dataKey="ts"
              type="number"
              scale="time"
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

            {/* Today divider */}
            {hasFuture && (
              <ReferenceLine
                x={lastTs} stroke="#7e92a6" strokeDasharray="4 4" strokeWidth={1}
                label={{ value: "Today", position: "insideTopRight", fill: "#7e92a6", fontSize: 8, fontFamily: "JetBrains Mono" }}
              />
            )}

            {/* Price line — connectNulls=false so line stops at last real price */}
            <Area
              type="monotone" dataKey="price"
              stroke={lineColor} strokeWidth={1.5}
              fill={`url(#sg-${companyId})`}
              dot={false} activeDot={{ r: 3, fill: lineColor, stroke: "#161c26", strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Catalyst markers at their actual calendar dates */}
            {chartMarkers.map((c, i) => {
              const mc = chartMarkerColor(c.type);
              return (
                <ReferenceDot
                  key={`cat-${i}`}
                  x={c.markerTs} y={c.displayPrice}
                  r={7}
                  fill={c.isFuture ? "transparent" : mc}
                  stroke={c.isFuture ? mc : "#0f1319"}
                  strokeWidth={2.5}
                  strokeDasharray={c.isFuture ? "3 2" : undefined}
                  isFront={true}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
        <div className="flex gap-2.5 text-[8px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
          {CHART_MARKER_LEGEND.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-[3px]">
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
          <span className="mx-1 opacity-30">|</span>
          <span className="inline-flex items-center gap-[3px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: "#7e92a6" }} />
            Past
          </span>
          <span className="inline-flex items-center gap-[3px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ border: "1.5px dashed #7e92a6", background: "transparent" }} />
            Upcoming
          </span>
        </div>
        <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
          {ticker} · {pastCount} past · {futureCount} upcoming · Yahoo Finance
        </div>
      </div>
    </div>
  );
}
