"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PDB, PEPTIDE_CLASSES, PEPTIDE_CLASSIFICATIONS, PEPTIDE_ROUTES } from "@/lib/peptide-data";
import PhaseBadge from "@/components/ui/PhaseBadge";
import PeptideClassBadge from "@/components/peptides/PeptideClassBadge";
import { PH } from "@/lib/biovault-data";

const PER_PAGE = 50;

export default function PeptideDictionaryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [classF, setClassF] = useState<string | null>(null);
  const [clsF, setClsF] = useState<string | null>(null);
  const [phaseF, setPhaseF] = useState<string | null>(null);
  const [routeF, setRouteF] = useState<string | null>(null);
  const [sort, setSort] = useState("phase");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pg, setPg] = useState(0);

  const PHASE_ORDER = ["Approved", "NDA/BLA", "Phase 3", "Phase 2/3", "Phase 2", "Phase 1/2", "Phase 1", "Preclinical"];

  const filtered = useMemo(() => {
    let d = PDB.peptides;
    if (classF) d = d.filter(p => p.classification === classF);
    if (clsF) d = d.filter(p => p.class === clsF);
    if (phaseF) d = d.filter(p => p.phase === phaseF);
    if (routeF) d = d.filter(p => p.route.includes(routeF));
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.aliases.some(a => a.toLowerCase().includes(q)) ||
        p.class.toLowerCase().includes(q)
      );
    }
    d = [...d].sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "class": cmp = a.class.localeCompare(b.class); break;
        case "phase": cmp = PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase); break;
        case "mw": cmp = a.molecularWeight - b.molecularWeight; break;
        default: cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return d;
  }, [search, classF, clsF, phaseF, routeF, sort, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice(pg * PER_PAGE, (pg + 1) * PER_PAGE);

  const toggleSort = (col: string) => {
    if (sort === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(col); setSortDir("asc"); }
  };

  const sel = (v: string | null, fn: (v: string | null) => void, label: string, opts: readonly string[]) => (
    <select value={v || ""} onChange={e => { fn(e.target.value || null); setPg(0); }}
      className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
      style={{ background: "var(--color-b2)", color: v ? "var(--color-a2)" : "var(--color-t2)", border: `1px solid ${v ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}` }}>
      <option value="">{label}</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  // Unique classes present in data
  const uniqueClasses = useMemo(() => [...new Set(PDB.peptides.map(p => p.class))].sort(), []);
  const uniqueRoutes = useMemo(() => [...new Set(PDB.peptides.flatMap(p => p.route.split(";")))].sort(), []);

  return (
    <div>
      <h1 className="font-serif font-[800] text-[18px] tracking-tight mb-1" style={{ color: "var(--color-t0)" }}>
        Peptide Dictionary <span className="text-[12px] font-mono font-normal" style={{ color: "var(--color-t2)" }}>({filtered.length})</span>
      </h1>
      <p className="text-[9px] mb-3" style={{ color: "var(--color-t2)" }}>Searchable glossary of therapeutic, diagnostic, and research peptides.</p>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPg(0); }}
          placeholder="Search peptides…"
          className="rounded px-[7px] py-[3px] text-[9px] outline-none w-[150px]"
          style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }} />
        {sel(classF, setClassF, "Classification", PEPTIDE_CLASSIFICATIONS)}
        {sel(clsF, setClsF, "Class", uniqueClasses)}
        {sel(phaseF, setPhaseF, "Phase", PH)}
        {sel(routeF, setRouteF, "Route", uniqueRoutes)}
        {(classF || clsF || phaseF || routeF || search) && (
          <button onClick={() => { setClassF(null); setClsF(null); setPhaseF(null); setRouteF(null); setSearch(""); setPg(0); }}
            className="rounded px-1.5 py-[3px] text-[9px] cursor-pointer"
            style={{ background: "rgba(255,107,107,0.1)", color: "var(--color-rd)", border: "1px solid rgba(255,107,107,0.15)" }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
        <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
          <table className="w-full text-[9px]">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: "var(--color-b2)" }}>
                {([
                  ["Peptide", "name"], ["Classification", null], ["Class", "class"],
                  ["Phase", "phase"], ["Target", null], ["MW (Da)", "mw"],
                  ["Route", null], ["Modifications", null],
                ] as const).map(([label, key]) => (
                  <th key={label}
                    className={`text-left px-2 py-1.5 font-semibold font-mono ${key ? "cursor-pointer select-none" : ""}`}
                    style={{ color: sort === key ? "var(--color-a2)" : "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}
                    onClick={() => key && toggleSort(key)}>
                    {label}{sort === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((pep, i) => {
                const tgt = PDB.targets.find(t => t.id === pep.targetIds[0]);
                return (
                  <tr key={pep.id}
                    className="cursor-pointer transition-colors"
                    style={{ animation: `fi 0.2s ${i * 0.02}s both` }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => router.push(`/peptides/dictionary/${pep.id}`)}>
                    <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-a2)", borderBottom: "1px solid var(--color-bd)" }}>
                      {pep.name}
                      {pep.aliases.length > 0 && <span className="font-normal ml-1 text-[8px]" style={{ color: "var(--color-t2)" }}>({pep.aliases[0]})</span>}
                    </td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}><PeptideClassBadge classification={pep.classification} /></td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{pep.class}</td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={pep.phase} /></td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>{tgt?.name || "—"}</td>
                    <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>
                      {pep.molecularWeight > 0 ? pep.molecularWeight.toLocaleString() : "—"}
                    </td>
                    <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{pep.route}</td>
                    <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}>
                      <div className="flex flex-wrap gap-0.5">
                        {pep.modifications.slice(0, 2).map(m => (
                          <span key={m} className="text-[7px] font-mono px-1 rounded" style={{ background: "var(--color-b2)", color: "var(--color-t2)" }}>{m}</span>
                        ))}
                        {pep.modifications.length > 2 && <span className="text-[7px] font-mono" style={{ color: "var(--color-t2)" }}>+{pep.modifications.length - 2}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-[8px] font-mono" style={{ color: "var(--color-t2)" }}>
            {pg * PER_PAGE + 1}–{Math.min((pg + 1) * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPg(p => Math.max(0, p - 1))} disabled={pg === 0}
              className="rounded px-2 py-[2px] text-[9px] cursor-pointer"
              style={{ background: "var(--color-b2)", color: pg === 0 ? "var(--color-t2)" : "var(--color-t0)", border: "1px solid var(--color-bd)" }}>
              ←
            </button>
            <button onClick={() => setPg(p => Math.min(totalPages - 1, p + 1))} disabled={pg === totalPages - 1}
              className="rounded px-2 py-[2px] text-[9px] cursor-pointer"
              style={{ background: "var(--color-b2)", color: pg === totalPages - 1 ? "var(--color-t2)" : "var(--color-t0)", border: "1px solid var(--color-bd)" }}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
