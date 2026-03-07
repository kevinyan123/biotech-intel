"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DrugDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const d = DB.drugs.find((x) => x.id === id);
  if (!d) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Drug not found</div>;

  const tr = DB.trials.filter((t) => t.drugId === id);
  const comp = DB.drugs.filter((x) => x.id !== id && (x.target === d.target || x.moa === d.moa)).slice(0, 10);
  const cat = DB.catalysts.filter((c) => c.drugId === id);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/drugs" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Pipeline</Link>
        <span className="opacity-30">|</span>
        <span>{d.name || d.code}</span>
      </div>

      <div className="mb-3.5">
        <div className="flex items-center gap-[7px] mb-0.5">
          <h2 className="text-lg font-bold">{d.name || d.code}</h2>
          <PhaseBadge phase={d.highestPhase || d.phase} />
        </div>
        {d.name && <div className="text-[10px] font-mono" style={{ color: "var(--color-t2)" }}>{d.code}</div>}
        <div className="text-[10px] mt-0.5" style={{ color: "var(--color-t2)" }}>
          By <Link href={`/companies/${d.companyId}`} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(d.companyId)?.marketCap ?? null)) }}>{d.companyName}</Link>
        </div>
        {d.aliases && d.aliases.length > 0 && (
          <div className="text-[9px] mt-1" style={{ color: "var(--color-t2)" }}>
            Aliases: {d.aliases.map((a, i) => <Tag key={i} color="var(--color-t2)">{a}</Tag>)}
          </div>
        )}
        <div className="flex gap-2 mt-1 text-[9px]" style={{ color: "var(--color-t2)" }}>
          <span>Source: <span style={{ color: "var(--color-a2)" }}>{d.source === "company_disclosure" ? "Company Disclosure" : "Trial-derived"}</span></span>
          <span>·</span>
          <span>Trials: <span className="font-mono font-semibold" style={{ color: "var(--color-ac)" }}>{d.trialCount || tr.length}</span></span>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[7px] mb-3.5">
        {[
          { l: "Modality", v: d.modality },
          { l: "MOA", v: d.moa },
          { l: "Target", v: d.target, link: `/targets/${encodeURIComponent(d.target)}` },
          { l: "Pathway", v: d.pathway },
        ].map((p, i) => (
          <BioCard key={i} onClick={p.link ? () => window.location.href = p.link! : undefined}>
            <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>{p.l}</div>
            <div className="text-[11px] font-semibold" style={{ color: p.link ? "var(--color-a2)" : "var(--color-t0)" }}>{p.v}</div>
          </BioCard>
        ))}
      </div>

      <div className="flex gap-0.5 mb-3 flex-wrap">
        {(d.allIndications || d.indications).map((x, i) => <Tag key={i} color="var(--color-a2)">{x}</Tag>)}
      </div>

      {/* Catalysts */}
      {cat.length > 0 && <>
        <SectionHeader>Catalysts</SectionHeader>
        <BioCard className="mb-2.5">
          {cat.map((c, i) => (
            <div key={i} className="flex gap-[7px] py-1 text-[10px]" style={{ borderBottom: i < cat.length - 1 ? "1px solid var(--color-bd)" : "none" }}>
              <span className="font-mono min-w-[64px] text-[9px]" style={{ color: "var(--color-ac)" }}>{c.date}</span>
              <span className="font-semibold">{c.type}</span>
              <span style={{ color: "var(--color-t2)" }}>· {c.indication}</span>
            </div>
          ))}
        </BioCard>
      </>}

      {/* Timeline */}
      {tr.length > 0 && (() => {
        const sorted = [...tr].sort((a, b) => a.startDate.localeCompare(b.startDate));
        const dates = sorted.flatMap((t) => [t.startDate, t.estCompletion]).filter(Boolean);
        const minD = dates.reduce((a, b) => a < b ? a : b);
        const maxD = dates.reduce((a, b) => a > b ? a : b);
        const minT = new Date(minD).getTime();
        const range = Math.max(1, new Date(maxD).getTime() - minT);
        const pct = (d: string) => ((new Date(d).getTime() - minT) / range) * 100;
        const statusColor: Record<string, string> = {
          Recruiting: "#00e676", Active: "#00f5b0", Completed: "#64b5f6",
          Terminated: "#ff6b6b", Withdrawn: "#ff6b6b", Suspended: "#ffb74d",
          "Not yet recruiting": "#b0bec5", "Enrolling by invitation": "#ce93d8",
        };
        const phaseOrder: Record<string, number> = { "Phase 1": 1, "Phase 1/2": 2, "Phase 2": 3, "Phase 2/3": 4, "Phase 3": 5, "NDA/BLA": 6, Approved: 7, Preclinical: 0 };
        const bySorted = [...sorted].sort((a, b) => (phaseOrder[a.phase] ?? 0) - (phaseOrder[b.phase] ?? 0));
        const years = new Set<string>();
        for (let y = new Date(minD).getFullYear(); y <= new Date(maxD).getFullYear(); y++) years.add(String(y));

        return <>
          <SectionHeader>Trial Timeline</SectionHeader>
          <BioCard className="mb-3">
            {/* Year markers */}
            <div className="relative h-4 mb-1" style={{ marginLeft: 90 }}>
              {[...years].map((y) => {
                const pos = pct(`${y}-01-01`);
                if (pos < 0 || pos > 100) return null;
                return <span key={y} className="absolute text-[7px] font-mono" style={{ left: `${pos}%`, color: "var(--color-t2)", transform: "translateX(-50%)" }}>{y}</span>;
              })}
            </div>
            {bySorted.map((t, i) => {
              const left = Math.max(0, Math.min(100, pct(t.startDate)));
              const right = Math.max(0, Math.min(100, pct(t.estCompletion)));
              const w = Math.max(1, right - left);
              const clr = statusColor[t.status] || "var(--color-t2)";
              const isTerminated = t.status === "Terminated" || t.status === "Withdrawn";
              return (
                <div key={t.id} className="flex items-center gap-1.5 py-[3px] cursor-pointer group"
                  style={{ borderBottom: i < bySorted.length - 1 ? "1px solid var(--color-bd)" : "none" }}
                  onClick={() => window.location.href = `/trials/${t.id}`}>
                  <div className="shrink-0 w-[82px] text-right">
                    <span className="text-[7px] font-mono font-semibold" style={{ color: clr }}>{t.phase.replace("Phase ", "P")}</span>
                  </div>
                  <div className="flex-1 relative h-[14px]" style={{ background: "var(--color-b2)", borderRadius: 3 }}>
                    <div style={{
                      position: "absolute", left: `${left}%`, width: `${w}%`, top: 1, bottom: 1,
                      borderRadius: 2, opacity: isTerminated ? 0.4 : 0.85,
                      background: isTerminated ? `repeating-linear-gradient(135deg,${clr}44,${clr}44 2px,${clr}22 2px,${clr}22 4px)` : `linear-gradient(90deg,${clr}55,${clr}bb)`,
                      border: `1px solid ${clr}${isTerminated ? "44" : "66"}`,
                    }} />
                    {/* Today marker */}
                    {(() => {
                      const todayPct = pct("2026-03-06");
                      return todayPct >= 0 && todayPct <= 100 ? (
                        <div style={{ position: "absolute", left: `${todayPct}%`, top: 0, bottom: 0, width: 1, background: "var(--color-ac)", opacity: 0.3 }} />
                      ) : null;
                    })()}
                  </div>
                  <div className="shrink-0 w-[55px]">
                    <span className="text-[7px] font-mono group-hover:underline" style={{ color: clr }}>{t.status.length > 8 ? t.status.slice(0, 7) + "…" : t.status}</span>
                  </div>
                </div>
              );
            })}
            {/* Legend */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {Object.entries(statusColor).filter(([s]) => tr.some((t) => t.status === s)).map(([s, c]) => (
                <span key={s} className="flex items-center gap-0.5 text-[7px]" style={{ color: c }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c }} />{s}
                </span>
              ))}
              <span className="flex items-center gap-0.5 text-[7px]" style={{ color: "var(--color-ac)", opacity: 0.5 }}>
                <span className="inline-block w-[6px] h-[1px]" style={{ background: "var(--color-ac)" }} />Today
              </span>
            </div>
          </BioCard>
        </>;
      })()}

      {/* Trials */}
      <SectionHeader>Trials ({tr.length})</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-3" style={{ border: "1px solid var(--color-bd)" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)" }}>
              {["NCT", "Phase", "Indication", "Status", "N", "EP"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tr.map((t) => (
              <tr key={t.id} onClick={() => window.location.href = `/trials/${t.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{t.nctId}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={t.phase} small /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <Link href={`/diseases/${encodeURIComponent(t.indication)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{t.indication}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><StatusDot status={t.status} /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{t.enrollment}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{t.endpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitors */}
      {comp.length > 0 && <>
        <SectionHeader>Competitors ({comp.length})</SectionHeader>
        <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)" }}>
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr style={{ background: "var(--color-b2)" }}>
                {["Drug", "Company", "Phase", "Target", "MOA"].map((h) => (
                  <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                    style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comp.map((r) => (
                <tr key={r.id} onClick={() => window.location.href = `/drugs/${r.id}`} className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.name || r.code}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", whiteSpace: "nowrap" }}>
                    <Link href={`/companies/${r.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(r.companyId)?.marketCap ?? null)) }}>{r.companyName}</Link>
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.highestPhase || r.phase} small /></td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.target}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{r.moa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  );
}
