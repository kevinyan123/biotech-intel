"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";
import BioCard from "@/components/ui/BioCard";
import { formatCurrency } from "@/lib/utils";

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

interface InsiderSummary {
  totalBuys: number;
  totalSells: number;
  netActivity: number;
  buyCount: number;
  sellCount: number;
}

interface InsiderResponse {
  found: boolean;
  ticker: string;
  transactions: InsiderTransaction[];
  summary: InsiderSummary;
}

type FilterType = "All" | "Buy" | "Sell";

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface InsiderTradingProps {
  ticker: string;
  cik?: number | null;        // pre-validated CIK from identity resolution
  validated?: boolean;         // whether identity was validated
  secEligible?: boolean;       // whether SEC data is applicable for this exchange
  companyName?: string;        // for display in messages
}

export default function InsiderTrading({
  ticker, cik, validated, secEligible = true, companyName,
}: InsiderTradingProps) {
  const [data, setData] = useState<InsiderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    // Don't fetch if SEC not applicable for this exchange
    if (!secEligible) {
      setLoading(false);
      return;
    }
    // Don't fetch if identity resolution ran and validation failed
    if (validated === false) {
      setLoading(false);
      return;
    }
    // Wait for identity resolution to complete (validated is still undefined)
    if (cik === undefined && validated === undefined) {
      // Identity not yet resolved — keep loading
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({ ticker });
    if (cik) params.set("cik", String(cik));

    fetch(`/api/insider?${params}`)
      .then((r) => r.json())
      .then((d: InsiderResponse) => setData(d))
      .catch(() =>
        setData({
          found: false,
          ticker,
          transactions: [],
          summary: { totalBuys: 0, totalSells: 0, netActivity: 0, buyCount: 0, sellCount: 0 },
        }),
      )
      .finally(() => setLoading(false));
  }, [ticker, cik, validated, secEligible]);

  // Filtered transactions
  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "All") return data.transactions;
    return data.transactions.filter((t) => t.type === filter);
  }, [data, filter]);

  // Monthly aggregation for bar chart
  const chartData = useMemo(() => {
    if (!data || data.transactions.length === 0) return [];
    const monthMap = new Map<string, { month: string; buys: number; sells: number }>();

    for (const t of data.transactions) {
      const d = new Date(t.date + "T00:00:00");
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${MO[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;

      if (!monthMap.has(key)) {
        monthMap.set(key, { month: label, buys: 0, sells: 0 });
      }
      const entry = monthMap.get(key)!;
      if (t.type === "Buy") entry.buys += t.totalValue;
      else entry.sells += t.totalValue;
    }

    return [...monthMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({
        month: v.month,
        Buys: Math.round(v.buys),
        Sells: Math.round(v.sells),
      }));
  }, [data]);

  // ── Not SEC-eligible (international exchange) ──
  if (!secEligible) {
    return (
      <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
        <div className="text-xs" style={{ color: "var(--color-t2)" }}>
          Insider trading data is not available for non-US exchanges.
        </div>
      </BioCard>
    );
  }

  // ── Identity validation failed (mismatch) ──
  if (validated === false) {
    return (
      <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
        <div className="text-xs" style={{ color: "var(--color-t2)" }}>
          Insider trading data suppressed — company identity could not be verified.
        </div>
      </BioCard>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
        <div className="text-xs" style={{ color: "var(--color-t2)" }}>
          <span className="inline-block animate-pulse">
            Fetching insider trading data from SEC EDGAR...
          </span>
        </div>
      </BioCard>
    );
  }

  // ── No data ──
  if (!data || !data.found || data.transactions.length === 0) {
    return (
      <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
        <div className="text-xs" style={{ color: "var(--color-t2)" }}>
          No recent insider trading activity for{" "}
          <span className="font-mono font-semibold">{ticker}</span>.
        </div>
      </BioCard>
    );
  }

  const { summary } = data;

  return (
    <div className="mb-4">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <BioCard style={{ textAlign: "center", padding: 12 }}>
          <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>
            Total Buys
          </div>
          <div className="text-[18px] font-bold font-mono" style={{ color: "#00e676" }}>
            {formatCurrency(summary.totalBuys)}
          </div>
          <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
            {summary.buyCount} transaction{summary.buyCount !== 1 ? "s" : ""}
          </div>
        </BioCard>
        <BioCard style={{ textAlign: "center", padding: 12 }}>
          <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>
            Total Sells
          </div>
          <div className="text-[18px] font-bold font-mono" style={{ color: "#ff6b6b" }}>
            {formatCurrency(summary.totalSells)}
          </div>
          <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
            {summary.sellCount} transaction{summary.sellCount !== 1 ? "s" : ""}
          </div>
        </BioCard>
        <BioCard style={{ textAlign: "center", padding: 12 }}>
          <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>
            Net Activity
          </div>
          <div
            className="text-[18px] font-bold font-mono"
            style={{ color: summary.netActivity >= 0 ? "#00e676" : "#ff6b6b" }}
          >
            {summary.netActivity >= 0 ? "+" : ""}
            {formatCurrency(summary.netActivity)}
          </div>
          <div className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>
            {summary.netActivity >= 0 ? "Net Buying" : "Net Selling"}
          </div>
        </BioCard>
      </div>

      {/* ── Bar Chart ── */}
      {chartData.length > 0 && (
        <BioCard style={{ padding: 16 }} className="mb-3">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t2)" }}>
            Monthly Insider Activity
          </div>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-bd)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-t2)"
                  fontSize={8}
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-bd)" }}
                />
                <YAxis
                  tickFormatter={(v: number) => formatCurrency(v)}
                  stroke="var(--color-t2)"
                  fontSize={8}
                  fontFamily="JetBrains Mono, monospace"
                  tickLine={false}
                  axisLine={false}
                  width={55}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-b2)",
                    border: "1px solid var(--color-bd2)",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "var(--color-t2)", fontFamily: "JetBrains Mono, monospace" }}
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                />
                <Bar dataKey="Buys" fill="#00e676" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Sells" fill="#ff6b6b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[9px]" style={{ color: "var(--color-t2)" }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: "#00e676" }} />
              Buys
            </div>
            <div className="flex items-center gap-1.5 text-[9px]" style={{ color: "var(--color-t2)" }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: "#ff6b6b" }} />
              Sells
            </div>
          </div>
        </BioCard>
      )}

      {/* ── Filter Buttons ── */}
      <div className="flex items-center gap-[3px] mb-2">
        {(["All", "Buy", "Sell"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all font-mono"
            style={{
              background: filter === f ? "var(--color-acd)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(0,223,162,0.3)" : "var(--color-bd)"}`,
              color: filter === f ? "var(--color-ac)" : "var(--color-t2)",
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === "All"
              ? `All (${data.transactions.length})`
              : f === "Buy"
                ? `Buys (${summary.buyCount})`
                : `Sells (${summary.sellCount})`}
          </button>
        ))}
      </div>

      {/* ── Transaction List ── */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: "1px solid var(--color-bd)",
          maxHeight: 320,
          overflowY: "auto",
          background: "var(--color-b1)",
        }}
      >
        {filtered.length === 0 ? (
          <div className="p-5 text-center text-[11px]" style={{ color: "var(--color-t2)" }}>
            No {filter === "Buy" ? "buy" : "sell"} transactions found.
          </div>
        ) : (
          filtered.map((t, i) => (
            <a
              key={i}
              href={t.filingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors no-underline"
              style={{
                borderBottom: i < filtered.length - 1 ? "1px solid var(--color-bd)" : "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Buy/Sell badge */}
              <span
                className="font-mono text-[10px] font-bold min-w-[34px] px-1.5 py-0.5 rounded text-center shrink-0"
                style={{
                  color: t.type === "Buy" ? "#00e676" : "#ff6b6b",
                  background: t.type === "Buy" ? "#00e67612" : "#ff6b6b12",
                  border: `1px solid ${t.type === "Buy" ? "#00e67625" : "#ff6b6b25"}`,
                }}
              >
                {t.type === "Buy" ? "BUY" : "SELL"}
              </span>

              {/* Insider info */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{t.insiderName}</div>
                <div className="text-[9px] truncate" style={{ color: "var(--color-t2)" }}>
                  {t.insiderRole}
                </div>
              </div>

              {/* Transaction details */}
              <div className="text-right shrink-0">
                <div
                  className="font-mono text-[11px] font-semibold"
                  style={{ color: t.type === "Buy" ? "#00e676" : "#ff6b6b" }}
                >
                  {t.totalValue > 0 ? formatCurrency(t.totalValue) : `${t.shares.toLocaleString()} shs`}
                </div>
                <div className="text-[8px] font-mono" style={{ color: "var(--color-t2)" }}>
                  {t.shares.toLocaleString()} @ ${t.pricePerShare.toFixed(2)}
                </div>
              </div>

              {/* Date + link icon */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "var(--color-t2)" }}>
                  {t.date}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-a2)" }}>
                  ↗
                </span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="text-[8px] font-mono mt-1.5" style={{ color: "var(--color-t2)" }}>
        Source: SEC EDGAR Form 4 filings · {data.transactions.length} transaction{data.transactions.length !== 1 ? "s" : ""} · Updated hourly
      </div>
    </div>
  );
}
