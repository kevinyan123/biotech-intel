"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PDB } from "@/lib/peptide-data";
import BioCard from "@/components/ui/BioCard";
import PeptideCategoryCard from "@/components/peptides/PeptideCategoryCard";
import PhaseBadge from "@/components/ui/PhaseBadge";

const PHASE_ORDER = ["Approved", "NDA/BLA", "Phase 3", "Phase 2/3", "Phase 2", "Phase 1/2", "Phase 1", "Preclinical"];

export default function PeptidesHub() {
  const stats = useMemo(() => {
    const total = PDB.peptides.length;
    const approved = PDB.peptides.filter(p => p.phase === "Approved").length;
    const pipeline = total - approved;
    const targets = PDB.targets.length;
    const mfgs = PDB.manufacturers.length;
    const avgMW = Math.round(PDB.peptides.filter(p => p.molecularWeight > 0).reduce((s, p) => s + p.molecularWeight, 0) / PDB.peptides.filter(p => p.molecularWeight > 0).length);
    return { total, approved, pipeline, targets, mfgs, avgMW };
  }, []);

  const featured = useMemo(() => {
    return [...PDB.peptides]
      .sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase))
      .slice(0, 10);
  }, []);

  const classCounts = useMemo(() => {
    const map = new Map<string, number>();
    PDB.peptides.forEach(p => map.set(p.classification, (map.get(p.classification) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const topClasses = useMemo(() => {
    const map = new Map<string, number>();
    PDB.peptides.forEach(p => map.set(p.class, (map.get(p.class) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] mt-0.5 leading-relaxed max-w-[600px]" style={{ color: "var(--color-t2)" }}>
          A structured knowledge base of peptide therapeutics — covering {stats.total} peptides, {stats.targets} biological targets, and {stats.mfgs} manufacturers worldwide.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-5">
        {([
          ["Total Peptides", stats.total, "var(--color-a2)"],
          ["Approved", stats.approved, "#00e676"],
          ["In Pipeline", stats.pipeline, "var(--color-a3)"],
          ["Targets", stats.targets, "var(--color-ac)"],
          ["Manufacturers", stats.mfgs, "#ce93d8"],
          ["Avg MW (Da)", stats.avgMW.toLocaleString(), "var(--color-t1)"],
        ] as const).map(([label, value, color]) => (
          <BioCard key={label}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{label}</div>
            <div className="text-[17px] font-bold font-mono" style={{ color: color as string }}>{value}</div>
          </BioCard>
        ))}
      </div>

      {/* Category Cards */}
      <div className="text-[10px] font-semibold uppercase tracking-wide mb-2 font-mono" style={{ color: "var(--color-t2)" }}>Explore</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[7px] mb-6">
        <PeptideCategoryCard
          title="Peptide Dictionary"
          count={PDB.peptides.length}
          description="Searchable glossary of therapeutic peptides with mechanisms, targets, and clinical status."
          href="/peptides/dictionary"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64b5f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}
          preview={PDB.peptides.filter(p => p.phase === "Approved").slice(0, 3).map(p => `${p.name} — ${p.class}`)}
        />
        <PeptideCategoryCard
          title="Peptide Targets"
          count={PDB.targets.length}
          description="Biological targets and receptors relevant to peptide drug development."
          href="/peptides/targets"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64b5f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
          preview={PDB.targets.filter(t => t.peptideIds.length > 0).sort((a, b) => b.peptideIds.length - a.peptideIds.length).slice(0, 3).map(t => `${t.name} — ${t.peptideIds.length} peptides`)}
        />
        <PeptideCategoryCard
          title="Manufacturers"
          count={PDB.manufacturers.length}
          description="Peptide API manufacturers, CDMOs, and research suppliers worldwide."
          href="/peptides/manufacturers"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64b5f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><path d="M9 20v-4h6v4"/></svg>}
          preview={PDB.manufacturers.sort((a, b) => b.peptideIds.length - a.peptideIds.length).slice(0, 3).map(m => `${m.name} — ${m.type}`)}
        />
      </div>

      {/* Classification Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[7px] mb-6">
        <BioCard>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>By Classification</div>
          <div className="flex flex-col gap-1.5">
            {classCounts.map(([cls, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              const color = cls === "Therapeutic" ? "#00e676" : cls === "Diagnostic" ? "#64b5f6" : "#ce93d8";
              return (
                <div key={cls}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-medium" style={{ color: "var(--color-t1)" }}>{cls}</span>
                    <span className="text-[8px] font-mono" style={{ color }}>{count} ({pct}%)</span>
                  </div>
                  <div className="h-[4px] rounded-full" style={{ background: "var(--color-b2)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </BioCard>

        <BioCard>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Top Peptide Classes</div>
          <div className="flex flex-col gap-1">
            {topClasses.map(([cls, count]) => (
              <div key={cls} className="flex items-center justify-between">
                <span className="text-[9px]" style={{ color: "var(--color-t1)" }}>{cls}</span>
                <span className="text-[8px] font-mono font-semibold" style={{ color: "var(--color-a2)" }}>{count}</span>
              </div>
            ))}
          </div>
        </BioCard>
      </div>

      {/* Featured Peptides */}
      <div className="text-[10px] font-semibold uppercase tracking-wide mb-2 font-mono" style={{ color: "var(--color-t2)" }}>Featured Peptides</div>
      <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
        <table className="w-full text-[9px]">
          <thead>
            <tr style={{ background: "var(--color-b2)" }}>
              {["Peptide", "Class", "Phase", "Target", "Route", "MW"].map(h => (
                <th key={h} className="text-left px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featured.map((pep, i) => {
              const tgt = PDB.targets.find(t => t.id === pep.targetIds[0]);
              return (
                <tr key={pep.id}
                  className="cursor-pointer transition-colors"
                  style={{ animation: `fi 0.2s ${i * 0.03}s both` }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => window.location.href = `/peptides/dictionary/${pep.id}`}>
                  <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-a2)", borderBottom: "1px solid var(--color-bd)" }}>
                    {pep.name}
                    {pep.aliases.length > 0 && (
                      <span className="font-normal ml-1 text-[8px]" style={{ color: "var(--color-t2)" }}>({pep.aliases[0]})</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{pep.class}</td>
                  <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={pep.phase} /></td>
                  <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>{tgt?.name || "—"}</td>
                  <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{pep.route}</td>
                  <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{pep.molecularWeight > 0 ? `${pep.molecularWeight.toLocaleString()} Da` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right">
        <Link href="/peptides/dictionary" className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>
          View all {stats.total} peptides →
        </Link>
      </div>
    </div>
  );
}
