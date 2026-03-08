"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PDB } from "@/lib/peptide-data";
import Tag from "@/components/ui/Tag";

export default function PeptideManufacturersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState<string | null>(null);
  const [countryF, setCountryF] = useState<string | null>(null);
  const [sort, setSort] = useState("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const types = useMemo(() => [...new Set(PDB.manufacturers.map(m => m.type))].sort(), []);
  const countries = useMemo(() => [...new Set(PDB.manufacturers.map(m => m.country))].sort(), []);

  const data = useMemo(() => {
    let d = PDB.manufacturers.map(m => ({
      ...m,
      pepCount: m.peptideIds.length,
    }));

    if (typeF) d = d.filter(m => m.type === typeF);
    if (countryF) d = d.filter(m => m.country === countryF);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(m => m.name.toLowerCase().includes(q) || m.hq.toLowerCase().includes(q));
    }

    d.sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "type": cmp = a.type.localeCompare(b.type); break;
        case "count": cmp = a.pepCount - b.pepCount; break;
        default: cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return d;
  }, [search, typeF, countryF, sort, sortDir]);

  const toggleSort = (col: string) => {
    if (sort === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSort(col); setSortDir("desc"); }
  };

  return (
    <div>
      <h1 className="font-serif font-[800] text-[18px] tracking-tight mb-1" style={{ color: "var(--color-t0)" }}>
        Peptide Manufacturers <span className="text-[12px] font-mono font-normal" style={{ color: "var(--color-t2)" }}>({data.length})</span>
      </h1>
      <p className="text-[9px] mb-3" style={{ color: "var(--color-t2)" }}>CDMOs, API manufacturers, research suppliers, and pharma companies in the peptide space.</p>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search manufacturers…"
          className="rounded px-[7px] py-[3px] text-[9px] outline-none w-[160px]"
          style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }} />
        <select value={typeF || ""} onChange={e => setTypeF(e.target.value || null)}
          className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{ background: "var(--color-b2)", color: typeF ? "var(--color-a2)" : "var(--color-t2)", border: `1px solid ${typeF ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}` }}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={countryF || ""} onChange={e => setCountryF(e.target.value || null)}
          className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{ background: "var(--color-b2)", color: countryF ? "var(--color-a2)" : "var(--color-t2)", border: `1px solid ${countryF ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}` }}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || typeF || countryF) && (
          <button onClick={() => { setSearch(""); setTypeF(null); setCountryF(null); }}
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
                ["Manufacturer", "name"], ["Type", "type"], ["HQ", null],
                ["Country", null], ["Capabilities", null], ["Peptides", "count"], ["Main DB", null],
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
            {data.map((m, i) => (
              <tr key={m.id}
                className="cursor-pointer transition-colors"
                style={{ animation: `fi 0.2s ${i * 0.02}s both` }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-bh)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={() => router.push(`/peptides/manufacturers/${m.id}`)}>
                <td className="px-2 py-1.5 font-semibold" style={{ color: "var(--color-a2)", borderBottom: "1px solid var(--color-bd)" }}>{m.name}</td>
                <td className="px-2 py-1.5 font-mono" style={{ color: "var(--color-a3)", borderBottom: "1px solid var(--color-bd)" }}>{m.type}</td>
                <td className="px-2 py-1.5" style={{ color: "var(--color-t1)", borderBottom: "1px solid var(--color-bd)" }}>{m.hq}</td>
                <td className="px-2 py-1.5" style={{ color: "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{m.country}</td>
                <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}>
                  <div className="flex flex-wrap gap-0.5">
                    {m.capabilities.slice(0, 3).map(c => (
                      <span key={c} className="text-[7px] font-mono px-1 rounded" style={{ background: "var(--color-b2)", color: "var(--color-t2)" }}>{c}</span>
                    ))}
                    {m.capabilities.length > 3 && <span className="text-[7px] font-mono" style={{ color: "var(--color-t2)" }}>+{m.capabilities.length - 3}</span>}
                  </div>
                </td>
                <td className="px-2 py-1.5 font-mono font-bold" style={{ color: m.pepCount > 0 ? "var(--color-a2)" : "var(--color-t2)", borderBottom: "1px solid var(--color-bd)" }}>{m.pepCount}</td>
                <td className="px-2 py-1.5" style={{ borderBottom: "1px solid var(--color-bd)" }}>
                  {m.companyId && (
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
