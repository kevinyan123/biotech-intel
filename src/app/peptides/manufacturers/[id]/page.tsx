"use client";

import { use } from "react";
import Link from "next/link";
import { PDB } from "@/lib/peptide-data";
import { DB } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import Tag from "@/components/ui/Tag";
import PeptideClassBadge from "@/components/peptides/PeptideClassBadge";

export default function ManufacturerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mfg = PDB.manufacturers.find(m => m.id === id);

  if (!mfg) {
    return <div className="text-center py-20 text-[11px]" style={{ color: "var(--color-t2)" }}>Manufacturer not found</div>;
  }

  const peptides = PDB.peptides.filter(p => mfg.peptideIds.includes(p.id));
  const linkedCompany = mfg.companyId ? DB.companies.find(c => c.id === mfg.companyId) : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3">
        <Link href="/peptides/manufacturers" className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>← Manufacturers</Link>
        <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>|</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--color-t1)" }}>{mfg.name}</span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-serif font-[800] text-[22px] tracking-tight" style={{ color: "var(--color-t0)" }}>{mfg.name}</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[9px] font-mono px-1.5 py-[1px] rounded-sm"
            style={{ background: "rgba(255,171,102,0.1)", color: "var(--color-a3)", border: "1px solid rgba(255,171,102,0.2)" }}>
            {mfg.type}
          </span>
          <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>{mfg.hq}</span>
          {mfg.founded && <span className="text-[8px] font-mono" style={{ color: "var(--color-t2)" }}>Founded {mfg.founded}</span>}
          {mfg.website && (
            <a href={`https://${mfg.website}`} target="_blank" rel="noopener noreferrer"
              className="text-[8px] font-mono" style={{ color: "var(--color-a2)" }}>
              {mfg.website} ↗
            </a>
          )}
        </div>
      </div>

      {/* Cross-link to main DB */}
      {linkedCompany && (
        <div className="mb-4 rounded-lg p-2.5" style={{ background: "var(--color-acd)", border: "1px solid rgba(0,245,176,0.15)" }}>
          <Link href={`/companies/${linkedCompany.id}`} className="text-[9px] font-mono" style={{ color: "var(--color-ac)" }}>
            View {linkedCompany.name} company profile in main database →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-5">
        {([
          ["Peptides", peptides.length, "var(--color-a2)"],
          ["Type", mfg.type, "var(--color-a3)"],
          ["Country", mfg.country, "var(--color-t1)"],
          ["Capabilities", mfg.capabilities.length, "#ce93d8"],
        ] as const).map(([label, value, color]) => (
          <BioCard key={label}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{label}</div>
            <div className="text-[13px] font-bold font-mono" style={{ color: color as string }}>{value}</div>
          </BioCard>
        ))}
      </div>

      {/* Capabilities */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-t0)" }}>Manufacturing Capabilities</div>
        <div className="flex flex-wrap gap-1">
          {mfg.capabilities.map(c => (
            <Tag key={c} label={c} color="var(--color-a2)" />
          ))}
        </div>
      </div>

      {/* Specialties */}
      {mfg.specialties.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-t0)" }}>Specialties</div>
          <div className="flex flex-wrap gap-1">
            {mfg.specialties.map(s => (
              <Tag key={s} label={s} color="var(--color-a3)" />
            ))}
          </div>
        </div>
      )}

      {/* Peptide Portfolio */}
      {peptides.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Peptide Portfolio ({peptides.length})</div>
          <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
            <table className="w-full text-[9px]">
              <thead>
                <tr style={{ background: "var(--color-b2)" }}>
                  {["Peptide", "Classification", "Class", "Phase", "Target", "Route"].map(h => (
                    <th key={h} className="text-left px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peptides.map((p, i) => {
                  const tgt = PDB.targets.find(t => t.id === p.targetIds[0]);
                  return (
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
                      <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>{tgt?.name || "—"}</td>
                      <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{p.route}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
