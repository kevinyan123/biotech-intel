"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, ReferenceDot, ReferenceLine, CartesianGrid,
} from "recharts";
import { chartMarkerColor, chartMarkerCategory, relativeTime, CHART_MARKER_LEGEND } from "@/lib/catalyst-utils";

interface Catalyst { id: string; date: string; type: string; drugId: string; drugName: string | null; companyId: string; companyName: string; indication: string; }
interface PricePoint { date: string; price: number; volume: number; }

interface Props {
  companyId: string;
  ticker: string;
  marketCap: number;
  catalysts: Catalyst[];
}

const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtAxis = (d: string) => { const [y, m] = d.split("-"); return `${MO[parseInt(m) - 1]} '${y.slice(2)}`; };
const fmtFull = (d: string) => { const [y, m, day] = d.split("-"); return `${MO[parseInt(m) - 1]} ${parseInt(day)}, ${y}`; };

const todayStr = (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; })();

export default function StockChart({ companyId, ticker, marketCap, catalysts }: Props) {
  const [timeRange, setTimeRange] = useState<"6M"|"1Y"|"2Y">("1Y");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showPast, setShowPast] = useState(true);
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set());

  // Real stock data fetching
  const [allData, setAllData] = useState<PricePoint[]>([]);
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
          setAllData(data.prices);
          setStockName(data.name || null);
          setCurrentPrice(data.currentPrice || null);
        }
      })
      .catch(err => {
        setError("Failed to fetch stock data");
        setAllData([]);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    if (timeRange === "6M") cutoff.setMonth(cutoff.getMonth() - 6);
    else if (timeRange === "1Y") cutoff.setMonth(cutoff.getMonth() - 12);
    else cutoff.setMonth(cutoff.getMonth() - 24);
    const cutStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth()+1).padStart(2,"0")}-${String(cutoff.getDate()).padStart(2,"0")}`;
    return allData.filter(d => d.date >= cutStr);
  }, [allData, timeRange]);

  // Price change calculation
  const priceChange = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0].price;
    const last = filteredData[filteredData.length - 1].price;
    const change = last - first;
    const pct = (change / first) * 100;
    return { change, pct, isUp: change >= 0 };
  }, [filteredData]);

  // Price lookup map for catalyst markers
  const priceMap = useMemo(() => {
    const m = new Map<string, number>();
    allData.forEach(d => m.set(d.date, d.price));
    return m;
  }, [allData]);

  const visibleCatalysts = useMemo(() => {
    return catalysts.filter(c => {
      if (!showUpcoming && c.date >= todayStr) return false;
      if (!showPast && c.date < todayStr) return false;
      const cat = chartMarkerCategory(c.type);
      if (hiddenCats.has(cat)) return false;
      // Only show past catalysts within chart range (they have price data)
      if (filteredData.length === 0) return false;
      if (c.date < filteredData[0].date) return false;
      // For past catalysts, must be within data range
      if (c.date < todayStr && c.date > filteredData[filteredData.length - 1].date) return false;
      return true;
    });
  }, [catalysts, showUpcoming, showPast, hiddenCats, filteredData]);

  // Find closest price for a catalyst date
  const catPrice = (date: string): number | null => {
    if (priceMap.has(date)) return priceMap.get(date)!;
    // Find nearest trading day
    const sorted = [...priceMap.keys()].sort();
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] >= date) return priceMap.get(sorted[i])!;
    }
    return priceMap.get(sorted[sorted.length - 1]) ?? null;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const price = payload[0].value;
    const date = label;
    const dayCats = catalysts.filter(c => c.date === date);
    return (
      <div style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd2)", borderRadius: 8, padding: "8px 12px", fontSize: 11, maxWidth: 240 }}>
        <div className="font-mono text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>{fmtFull(date)}</div>
        <div className="font-mono font-bold text-[14px]" style={{ color: "var(--color-ac)" }}>${price.toFixed(2)}</div>
        {dayCats.map((c, i) => (
          <div key={i} className="mt-1.5 pt-1.5" style={{ borderTop: "1px solid var(--color-bd)" }}>
            <div className="flex items-center gap-1.5">
              <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: chartMarkerColor(c.type) }} />
              <span className="text-[9px] font-bold" style={{ color: chartMarkerColor(c.type) }}>{c.type}</span>
            </div>
            <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--color-t0)" }}>{c.drugName}</div>
            <div className="text-[8px]" style={{ color: "var(--color-t2)" }}>{c.indication}</div>
            <div className="text-[8px] font-mono" style={{ color: chartMarkerColor(c.type) }}>{relativeTime(c.date)}</div>
          </div>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ height: 300 }} className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs animate-pulse" style={{ color: "var(--color-t2)" }}>
            Loading {ticker} stock data...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || filteredData.length === 0) {
    return (
      <div style={{ height: 200 }} className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: "var(--color-t2)" }}>
            {error || `No price data available for ${ticker}`}
          </div>
          <div className="text-[10px]" style={{ color: "var(--color-t2)", opacity: 0.6 }}>
            Stock data is only available for real publicly traded tickers.
          </div>
        </div>
      </div>
    );
  }

  // Compute Y domain with some padding
  const prices = filteredData.map(d => d.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const pad = (maxP - minP) * 0.1 || 1;

  const toggleCat = (key: string) => {
    setHiddenCats(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Determine line color based on price change
  const lineColor = priceChange && priceChange.isUp ? "#00f5b0" : "#ff6b6b";

  return (
    <div>
      {/* Price header */}
      <div className="flex items-baseline gap-2.5 mb-3">
        {currentPrice && (
          <span className="font-mono font-bold text-[20px]" style={{ color: "var(--color-t0)" }}>
            ${currentPrice.toFixed(2)}
          </span>
        )}
        {priceChange && (
          <span className="font-mono text-[11px] font-semibold" style={{ color: priceChange.isUp ? "#00e676" : "#ff6b6b" }}>
            {priceChange.isUp ? "+" : ""}{priceChange.change.toFixed(2)} ({priceChange.isUp ? "+" : ""}{priceChange.pct.toFixed(1)}%)
            <span className="font-normal ml-1" style={{ color: "var(--color-t2)" }}>{timeRange}</span>
          </span>
        )}
        {stockName && (
          <span className="text-[9px] ml-auto" style={{ color: "var(--color-t2)" }}>{stockName}</span>
        )}
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
          {[{ label: "Past", active: showPast, toggle: () => setShowPast(!showPast), color: "var(--color-t2)" },
            { label: "Upcoming", active: showUpcoming, toggle: () => setShowUpcoming(!showUpcoming), color: "var(--color-ac)" },
          ].map(f => (
            <button key={f.label} onClick={f.toggle}
              className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all"
              style={{ background: f.active ? `${f.color}15` : "transparent", border: `1px solid ${f.active ? `${f.color}44` : "var(--color-bd)"}`, color: f.active ? f.color : "var(--color-t2)", fontWeight: f.active ? 600 : 400 }}>
              {f.label}
            </button>
          ))}
          <span className="w-px h-4 mx-0.5" style={{ background: "var(--color-bd)" }} />
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

      {/* Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`sg-${companyId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" vertical={false} />
            <XAxis
              dataKey="date" tickFormatter={fmtAxis}
              stroke="#7e92a6" fontSize={8} fontFamily="JetBrains Mono, monospace"
              tickLine={false} axisLine={{ stroke: "#2a3a4e" }}
              interval={Math.max(1, Math.floor(filteredData.length / 8))}
            />
            <YAxis
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              stroke="#7e92a6" fontSize={8} fontFamily="JetBrains Mono, monospace"
              tickLine={false} axisLine={false}
              domain={[Math.floor(minP - pad), Math.ceil(maxP + pad)]}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#7e92a644", strokeDasharray: "3 3" }} />

            <Area
              type="monotone" dataKey="price"
              stroke={lineColor} strokeWidth={1.5}
              fill={`url(#sg-${companyId})`}
              dot={false} activeDot={{ r: 3, fill: lineColor, stroke: "#161c26", strokeWidth: 2 }}
            />

            {/* Catalyst markers */}
            {visibleCatalysts.map((c, i) => {
              const p = catPrice(c.date);
              if (p === null) return null;
              const mc = chartMarkerColor(c.type);
              const isFuture = c.date >= todayStr;
              return (
                <ReferenceDot
                  key={`cat-${i}`}
                  x={c.date} y={p}
                  r={5}
                  fill={isFuture ? "transparent" : mc}
                  stroke={mc}
                  strokeWidth={isFuture ? 2 : 1.5}
                  strokeDasharray={isFuture ? "2 2" : undefined}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + Price info */}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
        <div className="flex gap-2.5 text-[8px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
          {CHART_MARKER_LEGEND.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-[3px]">
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-[3px]">
            <span className="w-[6px] h-[6px] rounded-full" style={{ border: "1.5px dashed var(--color-t2)", background: "transparent" }} />
            Upcoming
          </span>
        </div>
        <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
          {ticker} · {visibleCatalysts.length} catalyst{visibleCatalysts.length !== 1 ? "s" : ""} shown · Yahoo Finance
        </div>
      </div>
    </div>
  );
}
