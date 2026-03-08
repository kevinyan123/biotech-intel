"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PDB, TARGET_FAMILIES } from "@/lib/peptide-data";

export default function PeptideTargetsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [familyF, setFamilyF] = useState<string | null>(null);
  const [sort, setSort] = useState("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const data = useMemo(() => {
    let d = PDB.targets.map(t => ({
      ...t,
      pepCount: t.peptideIds.length,
    }));

    if (familyF) d = d.filter(t => t.family === familyF);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(t => t.name.toLowerCase().includes(q) || t.fullName.toLowerCase().includes(q));
    }

    d.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "family": cmp = a.family.localeCompare(b.family); break;
        case "count": cmp = a.pepCount - b.pepCount; break;
        default: cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return d;
  }, [search, familyF, sort, sortDir]);

  const toggleSort = (col: string) => {
    if (sort === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(col); setSortDir("desc"); }
  };

  return (
    <div>
      <h1 className="font-serif font-[800] text-[18px] tracking-tight mb-1" style={{ color: "var(--color-t0)" }}>
        Peptide Targets <span className="text-[12px] font-mono font-normal" style={{ color: "var(--color-t2)" }}>({data.length})</span>
      </h1>
      <p className="text-[9px] mb-3" style={{ color: "var(--color-t2)" }}>Biological targets and receptors relevant to peptide therapeutics.</p>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search targets…"
          className="rounded px-[7px] py-[3px] text-[9px] outline-none w-[150px]"
          style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }} />
        <select value={familyF || ""} onChange={e => setFamilyF(e.target.value || null)}
          className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{ background: "var(--color-b2)", color: familyF ? "var(--color-a2)" : "var(--color-t2)", border: `1px solid ${familyF ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}` }}>
          <option value="">All Families</option>
          {TARGET_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        {(search || familyF) && (
          <button onClick={() => { setSearch(""); setFamilyF(null); }}
            className="rounded px-1.5 py-[3px] text-[9px] cursor-pointer"
            style={{ background: "rgba(255,107,107,0.1)", color: "var(--color-rd)", border: "1px solid rgba(255,107,107,0.15)" }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden border" style={{ background: "var(--color-b1)", borderColor: "var(--color-bd)" }}>
        <table className="w-full text-[9px]">
          <thead>
            <tr style={{ background: "var(--color-b2)" }}>
              {([
                ["Target", "name"], ["Full Name", null], ["Family", "family"],
                ["Pathway", null], ["Peptides", "count"], ["Main DB", null],
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
            {data.map((t, i) => (
              <tr key={t.id}
                className="cursor-pointer transition-colors"
                style={{ animation: `fi 0.2s ${i * 0.02}s both` }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={() => router.push(`/peptides/targets/${encodeURIComponent(t.name)}`)}>
                <td className="px-2 py-1.5 font-semibold font-mono" style={{ color: "var(--color-ac)", borderBottom: "1px solid var(--color-bd)" }}>{t.name}</td>
                <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{t.fullName}</td>
                <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-a3)", borderBottom: "1px solid var(--color-bd)" }}>{t.family}</td>
                <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{t.pathway}</td>
                <td className="px-2 py-1.5 font-mono font-bold" style={{ color: t.pepCount > 0 ? "var(--color-a2)" : "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{t.pepCount}</td>
                <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}>
                  {t.drugTargetName && (
                    <span className="text-[7px] font-mono px-1 rounded" style={{ background: "var(--color-acd)", color: "var(--color-ac)" }}>✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
