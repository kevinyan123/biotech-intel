"use client";

import { use } from "react";
import Link from "next/link";
import { PDB } from "@/lib/peptide-data";
import { DB } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import PeptideClassBadge from "@/components/peptides/PeptideClassBadge";
import Tag from "@/components/ui/Tag";

export default function PeptideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pep = PDB.peptides.find(p => p.id === id);

  if (!pep) {
    return <div className="text-center py-20 text-[11px]" style={{ color: "var(--color-t2)" }}>Peptide not found</div>;
  }

  const targets = PDB.targets.filter(t => pep.targetIds.includes(t.id));
  const mfgs = PDB.manufacturers.filter(m => pep.manufacturerIds.includes(m.id));
  const linkedDrugs = DB.drugs.filter(d => pep.drugIds.includes(d.id));
  const linkedCompanies = DB.companies.filter(c => pep.companyIds.includes(c.id));

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3">
        <Link href="/peptides/dictionary" className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>← Dictionary</Link>
        <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>|</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--color-t1)" }}>{pep.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <h1 className="font-serif font-[800] text-[22px] tracking-tight" style={{ color: "var(--color-t0)" }}>
            {pep.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <PhaseBadge phase={pep.phase} />
            <PeptideClassBadge classification={pep.classification} />
            <span className="text-[9px] font-mono px-1.5 py-[1px] rounded-sm"
              style={{ background: "rgba(100,181,246,0.08)", color: "var(--color-a2)", border: "1px solid rgba(100,181,246,0.15)" }}>
              {pep.class}
            </span>
            {pep.approvalYear && (
              <span className="text-[8px] font-mono" style={{ color: "var(--color-t2)" }}>
                Approved {pep.approvalYear}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Aliases */}
      {pep.aliases.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <span className="text-[8px] font-semibold uppercase tracking-wide font-mono" style={{ color: "var(--color-t2)" }}>Also known as:</span>
          {pep.aliases.map(a => (
            <Tag key={a} label={a} color="var(--color-a3)" />
          ))}
        </div>
      )}

      {/* Description */}
      {pep.description && (
        <div className="rounded-lg p-3 mb-4" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
          <div className="text-[10px] leading-relaxed" style={{ color: "var(--color-t1)" }}>{pep.description}</div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-5">
        {([
          ["Classification", pep.classification, "var(--color-t1)"],
          ["Phase", pep.phase, "#00e676"],
          ["Route", pep.route, "var(--color-a2)"],
          ["Residues", pep.residues > 0 ? `${pep.residues} aa` : "—", "var(--color-ac)"],
          ["Molecular Weight", pep.molecularWeight > 0 ? `${pep.molecularWeight.toLocaleString()} Da` : "—", "var(--color-a3)"],
          ["Half-Life", pep.halfLife, "var(--color-t1)"],
          ["Stability", pep.stability, pep.stability === "High" ? "#00e676" : pep.stability === "Low" ? "var(--color-rd)" : "var(--color-a3)"],
        ] as const).map(([label, value, color]) => (
          <BioCard key={label}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{label}</div>
            <div className="text-[13px] font-bold font-mono" style={{ color: color as string }}>{value}</div>
          </BioCard>
        ))}
      </div>

      {/* Modifications */}
      {pep.modifications.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-t0)" }}>Chemical Modifications</div>
          <div className="flex flex-wrap gap-1">
            {pep.modifications.map(m => (
              <Tag key={m} label={m} color="#ce93d8" />
            ))}
          </div>
        </div>
      )}

      {/* Indications */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--color-t0)" }}>Indications</div>
        <div className="flex flex-wrap gap-1">
          {pep.indications.map(ind => (
            <Link key={ind} href={`/diseases/${encodeURIComponent(ind)}`}>
              <Tag label={ind} color="var(--color-ac)" />
            </Link>
          ))}
        </div>
      </div>

      {/* Targets Section */}
      {targets.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Biological Targets ({targets.length})</div>
          <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
            <table className="w-full text-[9px]">
              <thead>
                <tr style={{ background: "var(--color-b2)" }}>
                  {["Target", "Full Name", "Family", "Pathway"].map(h => (
                    <th key={h} className="text-left px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {targets.map(t => (
                  <tr key={t.id} className="cursor-pointer transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => window.location.href = `/peptides/targets/${encodeURIComponent(t.name)}`}>
                    <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>
                      {t.name}
                      {t.drugTargetName && (
                        <Link href={`/targets/${encodeURIComponent(t.drugTargetName)}`}
                          className="ml-1.5 text-[7px] font-mono px-1 rounded"
                          style={{ background: "var(--color-acd)", color: "var(--color-ac)" }}
                          onClick={e => e.stopPropagation()}>
                          Main DB →
                        </Link>
                      )}
                    </td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{t.fullName}</td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-a3)", borderBottom: "1px solid var(--color-bd)" }}>{t.family}</td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{t.pathway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manufacturers Section */}
      {mfgs.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Manufacturers ({mfgs.length})</div>
          <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
            <table className="w-full text-[9px]">
              <thead>
                <tr style={{ background: "var(--color-b2)" }}>
                  {["Manufacturer", "Type", "Country", "Capabilities"].map(h => (
                    <th key={h} className="text-left px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mfgs.map(m => (
                  <tr key={m.id} className="cursor-pointer transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => window.location.href = `/peptides/manufacturers/${m.id}`}>
                    <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-a2)", borderBottom: "1px solid var(--color-bd)" }}>{m.name}</td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-a3)", borderBottom: "1px solid var(--color-bd)" }}>{m.type}</td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{m.country}</td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}>
                      <div className="flex flex-wrap gap-0.5">
                        {m.capabilities.slice(0, 3).map(c => (
                          <span key={c} className="text-[7px] font-mono px-1 rounded" style={{ background: "var(--color-b2)", color: "var(--color-t2)" }}>{c}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cross-links to Main DB */}
      {linkedDrugs.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Related Pipeline Drugs</div>
          <div className="flex flex-wrap gap-1.5">
            {linkedDrugs.map(d => (
              <Link key={d.id} href={`/drugs/${d.id}`} className="flex items-center gap-1 rounded px-2 py-1 text-[9px] transition-colors"
                style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>
                <span className="font-semibold" style={{ color: "var(--color-ac)" }}>{d.name || d.code}</span>
                <PhaseBadge phase={d.phase} />
                <span style={{ color: "var(--color-t2)" }}>{d.companyName}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {linkedCompanies.length > 0 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold mb-2" style={{ color: "var(--color-t0)" }}>Related Companies</div>
          <div className="flex flex-wrap gap-1.5">
            {linkedCompanies.map(c => (
              <Link key={c.id} href={`/companies/${c.id}`}>
                <Tag label={c.name} color="var(--color-ac)" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
