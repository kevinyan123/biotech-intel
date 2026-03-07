"use client";

import Link from "next/link";
import { DB, PH, TGT, IND, pC, mcTier, mcTierColor } from "@/lib/biovault-data";
import { milestoneColor, relativeTime } from "@/lib/catalyst-utils";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DashboardPage() {
  const pub = DB.companies.filter((c) => c.isPublic).length;
  const act = DB.trials.filter((t) => t.status === "Recruiting" || t.status === "Active").length;

  // Pipeline by phase
  const phD = PH.map((p) => ({ p, c: DB.drugs.filter((d) => d.phase === p).length }));
  const mx = Math.max(...phD.map((x) => x.c));

  // Country distribution
  const cc: Record<string, number> = {};
  DB.companies.forEach((c) => { cc[c.country] = (cc[c.country] || 0) + 1; });
  const topC = Object.entries(cc).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Market cap tier distribution
  const tiers: Record<string, number> = { Micro: 0, Small: 0, Mid: 0, Large: 0, Private: 0 };
  DB.companies.forEach((c) => { tiers[mcTier(c.marketCap)]++; });

  // Near-FDA companies
  const nearFDA = DB.companies
    .filter((co) => {
      const dr = DB.drugs.filter((d) => d.companyId === co.id);
      return dr.some((d) => ["Phase 3", "NDA/BLA"].includes(d.highestPhase || d.phase));
    })
    .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
    .slice(0, 8);

  return (
    <div style={{ animation: "fi .3s ease-out" }}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-serif text-[26px] font-[800] tracking-tight mb-0.5">
          Biotech <span style={{ color: "var(--color-ac)" }}>Investment Research</span>
        </h1>
        <p className="text-[11px]" style={{ color: "var(--color-t2)" }}>
          {DB.companies.length} companies · {DB.drugs.length} drug programs · {DB.trials.length} trials · {Object.keys(cc).length} countries
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(115px,1fr))] gap-[7px] mb-[18px]">
        {[
          { l: "Companies", v: DB.companies.length },
          { l: "Public", v: pub },
          { l: "Drugs", v: DB.drugs.length },
          { l: "Trials", v: DB.trials.length },
          { l: "Active", v: act },
          { l: "Catalysts", v: DB.catalysts.length },
          { l: "Targets", v: TGT.length },
          { l: "Indications", v: IND.length },
          { l: "Countries", v: Object.keys(cc).length },
        ].map((s, i) => (
          <BioCard key={i} style={{ animation: `fi .3s ease-out ${i * 0.03}s both` }}>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="text-[7px] font-semibold uppercase tracking-wide font-mono" style={{ color: "var(--color-t2)" }}>
                {s.l}
              </span>
            </div>
            <div className="text-xl font-bold font-mono">{s.v.toLocaleString()}</div>
          </BioCard>
        ))}
      </div>

      {/* Pipeline / Market Cap / Countries */}
      <div className="grid grid-cols-[5fr_2fr_2fr] gap-2.5 mb-3.5">
        {/* Pipeline by Phase */}
        <div>
          <SectionHeader>Pipeline by Phase</SectionHeader>
          <BioCard>
            <div className="flex gap-1 items-end h-[90px]">
              {phD.map((p, i) => {
                const c = pC(p.p);
                const h = Math.max(4, (p.c / mx) * 82);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <span className="text-[8px] font-mono font-semibold" style={{ color: c.f }}>{p.c}</span>
                    <div
                      style={{
                        width: "100%", height: h, borderRadius: "3px 3px 0 0",
                        background: `linear-gradient(180deg,${c.f}88,${c.f}20)`,
                        animation: `fi .4s ease-out ${i * 0.04}s both`,
                      }}
                    />
                    <span className="text-[6px] text-center font-mono" style={{ color: "var(--color-t2)" }}>
                      {p.p.replace("Phase ", "P").replace("Preclinical", "Pre").replace("NDA/BLA", "NDA").replace("Approved", "App")}
                    </span>
                  </div>
                );
              })}
            </div>
          </BioCard>
        </div>

        {/* By Market Cap */}
        <div>
          <SectionHeader>By Market Cap</SectionHeader>
          <BioCard>
            {Object.entries(tiers).map(([t, n], i) => (
              <div key={i} className="flex justify-between items-center py-[3px] text-[10px]"
                style={{ borderBottom: i < 4 ? "1px solid var(--color-bd)" : "none" }}>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: mcTierColor(t) }} />
                  <span style={{ color: "var(--color-t1)" }}>{t}</span>
                </span>
                <span className="font-mono font-semibold" style={{ color: mcTierColor(t) }}>{n}</span>
              </div>
            ))}
          </BioCard>
        </div>

        {/* Top Countries */}
        <div>
          <SectionHeader>Top Countries</SectionHeader>
          <BioCard>
            {topC.map(([co, n], i) => (
              <div key={i} className="flex justify-between py-[3px] text-[10px]"
                style={{ borderBottom: i < topC.length - 1 ? "1px solid var(--color-bd)" : "none" }}>
                <span style={{ color: "var(--color-t1)" }}>{co}</span>
                <span className="font-mono font-semibold" style={{ color: "var(--color-ac)" }}>{n}</span>
              </div>
            ))}
          </BioCard>
        </div>
      </div>

      {/* Upcoming Catalysts */}
      <SectionHeader>Upcoming Catalysts</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-3.5" style={{ border: "1px solid var(--color-bd)", maxHeight: 420, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Date", "When", "Company", "Drug", "Type", "Phase", "Indication"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DB.catalysts.slice(0, 25).map((c) => {
              const drug = DB.drugs.find((d) => d.id === c.drugId);
              const mc = milestoneColor(c.type);
              return (
                <tr key={c.id} onClick={() => window.location.href = `/drugs/${c.drugId}`}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="font-mono text-[9px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{c.date}</td>
                  <td className="font-mono text-[9px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mc }}>{relativeTime(c.date)}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Link href={`/companies/${c.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(c.companyId)?.marketCap ?? null)) }}>{c.companyName}</Link>
                  </td>
                  <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{c.drugName}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    <span className="inline-block rounded text-[8px] font-semibold font-mono whitespace-nowrap"
                      style={{ padding: "1px 6px", background: `${mc}20`, color: mc, border: `1px solid ${mc}33` }}>
                      {c.type}
                    </span>
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    {drug && <PhaseBadge phase={drug.phase} small />}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Link href={`/diseases/${encodeURIComponent(c.indication)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{c.indication}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Near FDA Approval */}
      <SectionHeader>Near FDA Approval</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-3.5" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Company", "Tier", "Cap", "Lead Program", "Phase", "Drugs"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nearFDA.map((co) => {
              const dr = DB.drugs.filter((d) => d.companyId === co.id);
              const lead = dr.find((d) => ["Phase 3", "NDA/BLA"].includes(d.highestPhase || d.phase));
              return (
                <tr key={co.id} onClick={() => window.location.href = `/companies/${co.id}`}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mcTierColor(mcTier(co.marketCap)) }}>{co.name}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    <span className="text-[8px] font-semibold" style={{ color: mcTierColor(mcTier(co.marketCap)) }}>{mcTier(co.marketCap)}</span>
                  </td>
                  <td className="font-mono text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>
                    {co.marketCap ? `$${co.marketCap >= 1 ? co.marketCap.toFixed(0) + "B" : (co.marketCap * 1000).toFixed(0) + "M"}` : "—"}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {lead ? (lead.name || lead.code) : "—"}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    {lead && <PhaseBadge phase={lead.highestPhase || lead.phase} small />}
                  </td>
                  <td className="font-mono font-semibold text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{dr.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Target Landscape */}
      <SectionHeader>Target Landscape</SectionHeader>
      <BioCard>
        <div className="flex flex-wrap gap-[3px]">
          {TGT.slice(0, 45).map((t, i) => {
            const n = DB.drugs.filter((d) => d.target === t).length;
            const int = Math.min(1, n / 30);
            return (
              <Link
                key={i}
                href={`/targets/${encodeURIComponent(t)}`}
                className="rounded text-[8px] font-semibold font-mono transition-transform hover:scale-[1.04]"
                style={{
                  padding: "2px 7px",
                  background: `rgba(0,223,162,${0.03 + int * 0.28})`,
                  border: `1px solid rgba(0,223,162,${0.05 + int * 0.35})`,
                  color: int > 0.2 ? "var(--color-ac)" : "var(--color-t2)",
                }}
              >
                {t} ({n})
              </Link>
            );
          })}
        </div>
      </BioCard>
    </div>
  );
}
