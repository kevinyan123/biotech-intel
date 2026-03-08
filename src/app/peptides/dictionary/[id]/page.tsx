"use client";

import { use } from "react";
import Link from "next/link";
import { PDB } from "@/lib/peptide-data";
import { DB } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
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
  const relatedPeptides = PDB.peptides.filter(p => pep.relatedPeptideIds.includes(p.id));

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[11px] font-semibold mb-1.5 mt-4 first:mt-0" style={{ color: "var(--color-t0)" }}>{children}</div>
  );

  const Prose = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[9.5px] leading-relaxed" style={{ color: "var(--color-t1)" }}>{children}</div>
  );

  const admin = pep.administrationMethod || pep.route.split(";")[0].trim();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3">
        <Link href="/peptides/dictionary" className="text-[9px] font-mono" style={{ color: "var(--color-a2)" }}>← Dictionary</Link>
        <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>|</span>
        <span className="text-[9px] font-mono" style={{ color: "var(--color-t1)" }}>{pep.name}</span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-serif font-[800] text-[22px] tracking-tight" style={{ color: "var(--color-t0)" }}>
          {pep.name}
        </h1>
        {pep.aliases.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <span className="text-[8px] font-semibold uppercase tracking-wide font-mono" style={{ color: "var(--color-t2)" }}>Also known as:</span>
            {pep.aliases.map(a => (
              <Tag key={a} color="var(--color-a3)">{a}</Tag>
            ))}
          </div>
        )}
      </div>

      {/* Overview */}
      {(pep.shortSummary || pep.description) && (
        <div className="rounded-lg p-3 mb-4" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
          <Prose>{pep.shortSummary || pep.description}</Prose>
          {pep.primaryBenefit && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[8px] font-semibold uppercase tracking-wide font-mono" style={{ color: "var(--color-t2)" }}>Primary benefit:</span>
              <span className="text-[9.5px] font-medium" style={{ color: "var(--color-a2)" }}>{pep.primaryBenefit}</span>
            </div>
          )}
          {pep.useCases.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pep.useCases.map(u => (
                <Tag key={u} color="var(--color-a2)">{u}</Tag>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Benefits */}
      {pep.benefits && (
        <>
          <SectionTitle>Benefits</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.benefits}</Prose>
          </div>
        </>
      )}

      {/* Administration */}
      {(pep.administrationMethod || pep.administrationDetails) && (
        <>
          <SectionTitle>Administration</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-mono px-1.5 py-[1px] rounded-sm"
                style={{ background: "rgba(100,181,246,0.08)", color: "var(--color-a2)", border: "1px solid rgba(100,181,246,0.15)" }}>
                {admin}
              </span>
            </div>
            {pep.administrationDetails && <Prose>{pep.administrationDetails}</Prose>}
          </div>
        </>
      )}

      {/* Storage */}
      {pep.storage && (
        <>
          <SectionTitle>Storage</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.storage}</Prose>
          </div>
        </>
      )}

      {/* Mechanism of Action */}
      {pep.mechanism && (
        <>
          <SectionTitle>Mechanism of Action</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.mechanism}</Prose>
          </div>
        </>
      )}

      {/* Biological Targets */}
      {targets.length > 0 && (
        <>
          <SectionTitle>Biological Targets</SectionTitle>
          <div className="rounded-lg overflow-hidden border mb-1" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
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
                    <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>{t.name}</td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{t.fullName}</td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-a3)", borderBottom: "1px solid var(--color-bd)" }}>{t.family}</td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{t.pathway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Properties Grid */}
      <SectionTitle>Properties</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-1">
        {([
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
        <>
          <SectionTitle>Chemical Modifications</SectionTitle>
          <div className="flex flex-wrap gap-1 mb-1">
            {pep.modifications.map(m => (
              <Tag key={m} color="#ce93d8">{m}</Tag>
            ))}
          </div>
        </>
      )}

      {/* Common Stacks */}
      {pep.stacks.length > 0 && (
        <>
          <SectionTitle>Common Stacks</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <ul className="space-y-1">
              {pep.stacks.map((s, i) => (
                <li key={i} className="text-[9.5px] flex items-start gap-1.5" style={{ color: "var(--color-t1)" }}>
                  <span style={{ color: "var(--color-a2)" }}>•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Safety Considerations */}
      {pep.safetyNotes && (
        <>
          <SectionTitle>Safety Considerations</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.safetyNotes}</Prose>
          </div>
        </>
      )}

      {/* Side Effects */}
      {pep.sideEffects && (
        <>
          <SectionTitle>Side Effects</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.sideEffects}</Prose>
          </div>
        </>
      )}

      {/* Research Background */}
      {pep.researchBackground && (
        <>
          <SectionTitle>Research Background</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <Prose>{pep.researchBackground}</Prose>
          </div>
        </>
      )}

      {/* Related Peptides */}
      {relatedPeptides.length > 0 && (
        <>
          <SectionTitle>Related Peptides</SectionTitle>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {relatedPeptides.map(rp => (
              <Link key={rp.id} href={`/peptides/dictionary/${rp.id}`}
                className="flex items-center gap-1 rounded px-2 py-1 text-[9px] transition-colors"
                style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>
                <span className="font-semibold" style={{ color: "var(--color-a2)" }}>{rp.name}</span>
                {rp.primaryBenefit && <span style={{ color: "var(--color-t2)" }}>— {rp.primaryBenefit}</span>}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Indications */}
      {pep.indications.length > 0 && (
        <>
          <SectionTitle>Indications</SectionTitle>
          <div className="flex flex-wrap gap-1 mb-1">
            {pep.indications.map(ind => (
              <Link key={ind} href={`/diseases/${encodeURIComponent(ind)}`}>
                <Tag color="var(--color-ac)">{ind}</Tag>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Manufacturers */}
      {mfgs.length > 0 && (
        <>
          <SectionTitle>Manufacturers ({mfgs.length})</SectionTitle>
          <div className="rounded-lg overflow-hidden border mb-1" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
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
        </>
      )}

      {/* Cross-links to Main DB */}
      {linkedDrugs.length > 0 && (
        <>
          <SectionTitle>Related Pipeline Drugs</SectionTitle>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {linkedDrugs.map(d => (
              <Link key={d.id} href={`/drugs/${d.id}`}
                className="flex items-center gap-1 rounded px-2 py-1 text-[9px] transition-colors"
                style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>
                <span className="font-semibold" style={{ color: "var(--color-ac)" }}>{d.name || d.code}</span>
                <span style={{ color: "var(--color-t2)" }}>{d.companyName}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Sources & References */}
      {pep.sources.length > 0 && (
        <>
          <SectionTitle>Sources &amp; References</SectionTitle>
          <div className="rounded-lg p-3 mb-1" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <ol className="space-y-1.5">
              {pep.sources.map((src, i) => (
                <li key={i} className="text-[9px] flex items-start gap-1.5" style={{ color: "var(--color-t2)" }}>
                  <span className="font-mono shrink-0" style={{ color: "var(--color-t2)" }}>[{i + 1}]</span>
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 transition-colors"
                    style={{ color: "var(--color-a2)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-t0)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-a2)")}>
                    {src.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
