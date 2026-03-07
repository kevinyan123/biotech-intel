"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

const fColor = (t: string) => ({ "10-K": "#4fc3f7", "10-Q": "#81c784", "8-K": "#ffb74d", "DEF 14A": "#ce93d8", "S-1/A": "#f48fb1" }[t] || "var(--color-t2)");

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

  const filings = co.isPublic ? [
    { type: "10-K", title: "Annual Report FY2025", date: "2026-02-28", desc: "Annual financial statements and business overview" },
    { type: "10-Q", title: "Q4 2025 Quarterly Report", date: "2026-01-15", desc: "Quarterly financial results" },
    { type: "8-K", title: "Phase 3 Topline Results Announcement", date: "2026-01-08", desc: "Material event disclosure — clinical trial results" },
    { type: "10-Q", title: "Q3 2025 Quarterly Report", date: "2025-10-12", desc: "Quarterly financial results" },
    { type: "8-K", title: "FDA Breakthrough Therapy Designation", date: "2025-09-22", desc: "Material event — regulatory milestone" },
    { type: "8-K", title: "Licensing Agreement Announcement", date: "2025-08-15", desc: "Partnership and licensing deal terms" },
    { type: "DEF 14A", title: "2025 Proxy Statement", date: "2025-04-20", desc: "Annual meeting proxy and executive compensation" },
    { type: "10-K", title: "Annual Report FY2024", date: "2025-02-27", desc: "Annual financial statements and business overview" },
  ] : [];

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
      {co.isPublic && filings.length > 0 && <>
        <SectionHeader>SEC Filings & Financial Documents</SectionHeader>
        <div className="rounded-lg mb-4" style={{ border: "1px solid var(--color-bd)", maxHeight: 260, overflowY: "auto", background: "var(--color-b1)" }}>
          {filings.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < filings.length - 1 ? "1px solid var(--color-bd)" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span className="font-mono text-[10px] font-bold min-w-[52px] px-1.5 py-0.5 rounded text-center shrink-0"
                style={{ color: fColor(f.type), background: `${fColor(f.type)}12`, border: `1px solid ${fColor(f.type)}25` }}>{f.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5">{f.title}</div>
                <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>{f.desc}</div>
              </div>
              <span className="font-mono text-[10px] whitespace-nowrap shrink-0" style={{ color: "var(--color-t2)" }}>{f.date}</span>
            </div>
          ))}
        </div>
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
