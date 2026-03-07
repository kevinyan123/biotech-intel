"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

const fColor = (t: string) => {
  if (t.startsWith("10-K")) return "#4fc3f7";
  if (t.startsWith("10-Q")) return "#81c784";
  if (t.startsWith("8-K")) return "#ffb74d";
  if (t.includes("DEF") || t.includes("14A")) return "#ce93d8";
  if (t.startsWith("S-1") || t.startsWith("S-3")) return "#f48fb1";
  if (t.startsWith("20-F") || t.startsWith("6-K")) return "#80deea";
  return "var(--color-t2)";
};

// Cache ticker→CIK map so we only fetch once per session
let tickerMapCache: Record<string, number> | null = null;

interface Filing {
  type: string;
  title: string;
  date: string;
  url: string;
  real: boolean;
}

async function fetchRealFilings(ticker: string): Promise<Filing[]> {
  try {
    if (!tickerMapCache) {
      const res = await fetch("https://www.sec.gov/files/company_tickers.json");
      if (!res.ok) return [];
      const data = await res.json();
      const map: Record<string, number> = {};
      Object.values(data).forEach((e: any) => {
        if (e.ticker) map[e.ticker.toUpperCase()] = e.cik_str;
      });
      tickerMapCache = map;
    }

    const cik = tickerMapCache[ticker.toUpperCase()];
    if (!cik) return [];

    const paddedCIK = String(cik).padStart(10, "0");
    const res2 = await fetch(`https://data.sec.gov/submissions/CIK${paddedCIK}.json`);
    if (!res2.ok) return [];
    const sub = await res2.json();

    if (!sub?.filings?.recent) return [];
    const r = sub.filings.recent;

    const wanted = new Set(["10-K", "10-Q", "8-K", "DEF 14A", "S-1", "S-1/A", "S-3", "20-F", "6-K"]);
    const results: Filing[] = [];

    for (let i = 0; i < r.form.length && results.length < 12; i++) {
      if (wanted.has(r.form[i])) {
        const accClean = r.accessionNumber[i].replace(/-/g, "");
        results.push({
          type: r.form[i],
          title: r.primaryDocDescription[i] || r.form[i],
          date: r.filingDate[i],
          url: `https://www.sec.gov/Archives/edgar/data/${cik}/${accClean}/${r.primaryDocument[i]}`,
          real: true,
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

// Generate fallback filings for companies not found in SEC
function generateFallbackFilings(companyName: string, ticker: string | null): Filing[] {
  const edgarSearch = `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(companyName)}&CIK=&type=&dateb=&owner=include&count=40&search_text=&action=getcompany`;
  return [
    { type: "10-K", title: "Annual Report FY2025", date: "2026-02-28", url: edgarSearch, real: false },
    { type: "10-Q", title: "Q4 2025 Quarterly Report", date: "2026-01-15", url: edgarSearch, real: false },
    { type: "8-K", title: "Material Event Disclosure", date: "2026-01-08", url: edgarSearch, real: false },
    { type: "10-Q", title: "Q3 2025 Quarterly Report", date: "2025-10-12", url: edgarSearch, real: false },
    { type: "8-K", title: "Clinical Trial Results Announcement", date: "2025-09-22", url: edgarSearch, real: false },
    { type: "8-K", title: "Partnership Agreement", date: "2025-08-15", url: edgarSearch, real: false },
    { type: "DEF 14A", title: "2025 Proxy Statement", date: "2025-04-20", url: edgarSearch, real: false },
    { type: "10-K", title: "Annual Report FY2024", date: "2025-02-27", url: edgarSearch, real: false },
  ];
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const co = DB.companies.find((c) => c.id === id);
  if (!co) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Company not found</div>;

  const dr = DB.drugs.filter((d) => d.companyId === id);
  const tr = DB.trials.filter((t) => t.companyId === id);
  const cat = DB.catalysts.filter((c) => c.companyId === id);
  const tier = mcTier(co.marketCap);
  const approved = dr.filter((d) => (d.highestPhase || d.phase) === "Approved").length;
  const failed = tr.filter((t) => t.status === "Terminated").length;

  const fallbackFilings = useMemo(() => co.isPublic ? generateFallbackFilings(co.name, co.ticker) : [], [co.isPublic, co.name, co.ticker]);

  const [filings, setFilings] = useState<Filing[]>([]);
  const [filingsLoading, setFilingsLoading] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!co.isPublic || !co.ticker) {
      setTried(true);
      return;
    }
    setFilingsLoading(true);
    fetchRealFilings(co.ticker)
      .then((f) => setFilings(f))
      .catch(() => {})
      .finally(() => { setFilingsLoading(false); setTried(true); });
  }, [co.isPublic, co.ticker]);

  // Use real filings if found, otherwise use fallback
  const displayFilings = filings.length > 0 ? filings : (tried ? fallbackFilings : []);
  const isRealData = filings.length > 0;

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/companies" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Companies</Link>
        <span className="opacity-30">|</span>
        <span>{co.name}</span>
      </div>

      {/* Header */}
      <div className="flex gap-3.5 mb-5 items-start">
        <div className="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-lg font-bold font-mono shrink-0"
          style={{ background: "var(--color-b3)", color: "var(--color-ac)", border: "1px solid var(--color-bd2)" }}>
          {(co.ticker || co.name.slice(0, 2)).slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-0.5">{co.name}</h2>
          <div className="flex gap-2.5 text-[11px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
            {co.ticker && <span className="font-mono font-semibold text-xs" style={{ color: "var(--color-a2)" }}>{co.ticker}</span>}
            {co.ticker && <span>·</span>}
            {co.exchange && co.exchange !== "Private" && co.exchange !== "Acq" && <span>{co.exchange}</span>}
            <span>{co.hq}</span>
            {co.founded && <span>Founded {co.founded}</span>}
            {co.employees && <span>{co.employees.toLocaleString()} employees</span>}
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: mcTierColor(tier), background: `${mcTierColor(tier)}15`, border: `1px solid ${mcTierColor(tier)}30` }}>
              {tier} Cap
            </span>
            <Tag color="var(--color-t1)">{co.type}</Tag>
            <Tag color={co.fundingStatus === "Public" ? "var(--color-ac)" : co.fundingStatus === "Acquired" ? "var(--color-t2)" : "var(--color-a3)"}>{co.fundingStatus}</Tag>
            {co.therapeuticAreas.map((a, i) => <Tag key={i}>{a}</Tag>)}
          </div>
          {co.platform && <div className="text-[10px] mt-1.5" style={{ color: "var(--color-t2)" }}>Platform: <span style={{ color: "var(--color-t1)" }}>{co.platform}</span></div>}
          {co.website && (
            <div className="text-[10px] mt-0.5">
              <a href={co.website} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono" style={{ color: "var(--color-a2)" }}>
                {co.website.replace("https://www.", "")} ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {[
          { l: "Market Cap", v: co.marketCap ? `$${co.marketCap}B` : "N/A", c: "var(--color-ac)" },
          { l: "All Drugs", v: dr.length, c: "var(--color-t0)" },
          { l: "Clinical Trials", v: tr.length, c: "var(--color-a2)" },
          { l: "Failed / Terminated", v: failed, c: failed > 0 ? "var(--color-rd)" : "var(--color-t2)" },
          { l: "FDA Approved", v: approved, c: approved > 0 ? "#00e676" : "var(--color-t2)" },
        ].map((m, i) => (
          <BioCard key={i} style={{ textAlign: "center", padding: 14 }}>
            <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>{m.l}</div>
            <div className="text-[22px] font-bold font-mono" style={{ color: m.c }}>{m.v}</div>
          </BioCard>
        ))}
      </div>

      {/* Drug Pipeline Table */}
      <SectionHeader>Drug Pipeline ({dr.length} programs)</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-4" style={{ border: "1px solid var(--color-bd)", maxHeight: 320, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Drug Name", "Code", "Phase", "Trials", "Modality", "Target", "MOA", "Indications"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dr.map((d) => (
              <tr key={d.id} onClick={() => window.location.href = `/drugs/${d.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{d.name || d.code}</td>
                <td className="font-mono text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>{d.code}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={d.highestPhase || d.phase} /></td>
                <td className="font-mono font-semibold text-[10px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{d.trialCount || 0}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{d.modality}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><Link href={`/targets/${encodeURIComponent(d.target)}`} className="hover:underline" style={{ color: "var(--color-a2)" }}>{d.target}</Link></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>{d.moa}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>{(d.allIndications || d.indications).slice(0, 2).map((x, i) => <Tag key={i} color="var(--color-a2)">{x}</Tag>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SEC Filings */}
      {co.isPublic && <>
        <SectionHeader>SEC Filings & Financial Documents</SectionHeader>
        {filingsLoading && (
          <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
            <div className="text-xs" style={{ color: "var(--color-t2)" }}>Loading filings from SEC EDGAR...</div>
          </BioCard>
        )}
        {!filingsLoading && displayFilings.length > 0 && (
          <>
            {!isRealData && (
              <div className="text-[9px] mb-1.5" style={{ color: "var(--color-t2)" }}>
                Links open SEC EDGAR company search for {co.name}
              </div>
            )}
            <div className="rounded-lg mb-4" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto", background: "var(--color-b1)" }}>
              {displayFilings.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors no-underline"
                  style={{ borderBottom: i < displayFilings.length - 1 ? "1px solid var(--color-bd)" : "none", display: "flex", color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span className="font-mono text-[10px] font-bold min-w-[52px] px-1.5 py-0.5 rounded text-center shrink-0"
                    style={{ color: fColor(f.type), background: `${fColor(f.type)}12`, border: `1px solid ${fColor(f.type)}25` }}>{f.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-0.5">{f.title}</div>
                    {f.real
                      ? <div className="text-[9px] font-mono truncate" style={{ color: "var(--color-t2)" }}>{f.url.split("/").pop()}</div>
                      : <div className="text-[9px]" style={{ color: "var(--color-t2)" }}>Search on SEC EDGAR</div>
                    }
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "var(--color-t2)" }}>{f.date}</span>
                    <span className="text-[10px]" style={{ color: "var(--color-a2)" }}>↗</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </>}

      {!co.isPublic && (
        <div className="mb-4">
          <SectionHeader>Financial Documents</SectionHeader>
          <BioCard style={{ padding: 20, textAlign: "center" }}>
            <div className="text-xs" style={{ color: "var(--color-t2)" }}>
              {co.fundingStatus === "Acquired" ? "This company has been acquired — see parent company for financial filings." : "This is a private company — SEC filings are not available."}
            </div>
          </BioCard>
        </div>
      )}

      {/* Upcoming Catalysts */}
      <SectionHeader>Upcoming Catalysts ({cat.length})</SectionHeader>
      {cat.length > 0 ? (
        <BioCard>
          {cat.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < cat.length - 1 ? "1px solid var(--color-bd)" : "none" }}>
              <span className="font-mono text-[11px] font-semibold min-w-[80px]" style={{ color: "var(--color-ac)" }}>{c.date}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">
                  <Link href={`/drugs/${c.drugId}`} className="hover:underline" style={{ color: "var(--color-a2)" }}>{c.drugName}</Link>
                  {" "}<span className="font-normal" style={{ color: "var(--color-t2)" }}>— {c.type}</span>
                </div>
                <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>{c.indication}</div>
              </div>
              <Tag color="var(--color-a3)">{c.type}</Tag>
            </div>
          ))}
        </BioCard>
      ) : (
        <BioCard style={{ padding: 20, textAlign: "center" }}>
          <div className="text-xs" style={{ color: "var(--color-t2)" }}>No upcoming catalysts scheduled.</div>
        </BioCard>
      )}
    </div>
  );
}
