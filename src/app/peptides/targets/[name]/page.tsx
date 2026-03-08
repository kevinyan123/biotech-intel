"use client";

import { use } from "react";
import Link from "next/link";
import { PDB } from "@/lib/peptide-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import PeptideClassBadge from "@/components/peptides/PeptideClassBadge";

export default function PeptideTargetDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const nm = decodeURIComponent(name);
  const target = PDB.targets.find(t => t.name === nm);

  if (!target) {
    return <div className="text-center py-20 text-[11px]" style={{ color: "var(--color-t2)" }}>Target not found</div>;
  }

  const peptides = PDB.peptides.filter(p => p.targetIds.includes(target.id));
  const approved = peptides.filter(p => p.phase === "Approved").length;
  const pipeline = peptides.length - approved;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3">
        <Link href="/peptides/targets" className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>← Peptide Targets</Link>
        <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>|</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--color-t1)" }}>{target.name}</span>
      </div>

      {/* Header */}
      <h1 className="font-serif font-[800] text-[22px] tracking-tight" style={{ color: "var(--color-t0)" }}>{target.name}</h1>
      <p className="text-[11px] mb-1" style={{ color: "var(--color-t1)" }}>{target.fullName}</p>
      <p className="text-[9px] mb-4 leading-relaxed" style={{ color: "var(--color-t2)" }}>{target.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-5">
        {([
          ["Total Peptides", peptides.length, "var(--color-a2)"],
          ["Approved", approved, "#00e676"],
          ["Pipeline", pipeline, "var(--color-a3)"],
          ["Family", target.family, "#ce93d8"],
          ["Pathway", target.pathway, "var(--color-t1)"],
        ] as const).map(([label, value, color]) => (
          <BioCard key={label}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{label}</div>
            <div className="text-[13px] font-bold font-mono" style={{ color: color as string }}>{value}</div>
          </BioCard>
        ))}
      </div>

      {/* Cross-link to main targets */}
      {target.drugTargetName && (
        <div className="mb-4 rounded-lg p-2.5" style={{ background: "var(--color-acd)", border: "1px solid rgba(0,245,176,0.15)" }}>
          <Link href={`/targets/${encodeURIComponent(target.drugTargetName)}`} className="text-[9px] font-mono" style={{ color: "var(--color-ac)" }}>
            View all drug programs targeting {target.drugTargetName} in the main database →
          </Link>
        </div>
      )}

      {/* Peptides Table */}
      {peptides.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Peptides Targeting {target.name} ({peptides.length})</div>
          <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
            <table className="w-full text-[9px]">
              <thead>
                <tr style={{ background: "var(--color-b2)" }}>
                  {["Peptide", "Classification", "Class", "Phase", "Route", "MW (Da)"].map(h => (
                    <th key={h} className="text-left px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peptides.map((p, i) => (
                  <tr key={p.id}
                    className="cursor-pointer transition-colors"
                    style={{ animation: `fi 0.2s ${i * 0.02}s both` }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => window.location.href = `/peptides/dictionary/${p.id}`}>
                    <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-a2)", borderBottom: "1px solid var(--color-bd)" }}>
                      {p.name}
                      {p.aliases.length > 0 && <span className="font-normal ml-1 text-[8px]" style={{ color: "var(--color-t2)" }}>({p.aliases[0]})</span>}
                    </td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}><PeptideClassBadge classification={p.classification} /></td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{p.class}</td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={p.phase} /></td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{p.route}</td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>
                      {p.molecularWeight > 0 ? p.molecularWeight.toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
