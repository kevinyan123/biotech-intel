"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PDB, PEPTIDE_USE_CASES } from "@/lib/peptide-data";
import BioCard from "@/components/ui/BioCard";

export default function PeptideDictionaryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [useCaseF, setUseCaseF] = useState<string | null>(null);
  const [adminF, setAdminF] = useState<string | null>(null);
  const [letter, setLetter] = useState<string | null>(null);

  // Unique admin methods present in data
  const adminMethods = useMemo(() => {
    const set = new Set<string>();
    PDB.peptides.forEach(p => {
      if (p.administrationMethod) set.add(p.administrationMethod);
      else p.route.split(";").forEach(r => set.add(r.trim()));
    });
    return [...set].sort();
  }, []);

  // Available first letters
  const letters = useMemo(() => {
    const set = new Set<string>();
    PDB.peptides.forEach(p => set.add(p.name[0].toUpperCase()));
    return [...set].sort();
  }, []);

  // Use cases that actually appear in data
  const activeCases = useMemo(() => {
    const set = new Set<string>();
    PDB.peptides.forEach(p => p.useCases.forEach(u => set.add(u)));
    return PEPTIDE_USE_CASES.filter(u => set.has(u));
  }, []);

  const filtered = useMemo(() => {
    let d = PDB.peptides;

    if (letter) d = d.filter(p => p.name[0].toUpperCase() === letter);

    if (useCaseF) d = d.filter(p => p.useCases.includes(useCaseF));

    if (adminF) {
      d = d.filter(p =>
        p.administrationMethod === adminF || p.route.includes(adminF)
      );
    }

    if (search) {
      const q = search.toLowerCase();
      d = d.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.aliases.some(a => a.toLowerCase().includes(q)) ||
        p.primaryBenefit.toLowerCase().includes(q) ||
        p.shortSummary.toLowerCase().includes(q) ||
        p.useCases.some(u => u.toLowerCase().includes(q))
      );
    }

    return [...d].sort((a, b) => a.name.localeCompare(b.name));
  }, [search, useCaseF, adminF, letter]);

  const hasFilters = !!(search || useCaseF || adminF || letter);

  return (
    <div>
      <h1 className="font-serif font-[800] text-[18px] tracking-tight mb-1" style={{ color: "var(--color-t0)" }}>
        Peptide Dictionary{" "}
        <span className="text-[12px] font-mono font-normal" style={{ color: "var(--color-t2)" }}>
          ({filtered.length})
        </span>
      </h1>
      <p className="text-[9px] mb-3" style={{ color: "var(--color-t2)" }}>
        Educational knowledge base covering benefits, mechanisms, administration, and use cases.
      </p>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search peptides…"
          className="rounded px-[7px] py-[3px] text-[9px] outline-none w-[170px]"
          style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }}
        />
        <select
          value={useCaseF || ""}
          onChange={e => setUseCaseF(e.target.value || null)}
          className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{
            background: "var(--color-b2)",
            color: useCaseF ? "var(--color-a2)" : "var(--color-t2)",
            border: `1px solid ${useCaseF ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}`,
          }}
        >
          <option value="">Use Case</option>
          {activeCases.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <select
          value={adminF || ""}
          onChange={e => setAdminF(e.target.value || null)}
          className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{
            background: "var(--color-b2)",
            color: adminF ? "var(--color-a2)" : "var(--color-t2)",
            border: `1px solid ${adminF ? "rgba(100,181,246,0.3)" : "var(--color-bd)"}`,
          }}
        >
          <option value="">Admin Method</option>
          {adminMethods.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setUseCaseF(null); setAdminF(null); setLetter(null); }}
            className="rounded px-1.5 py-[3px] text-[9px] cursor-pointer"
            style={{ background: "rgba(255,107,107,0.1)", color: "var(--color-rd)", border: "1px solid rgba(255,107,107,0.15)" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Alphabetical Bar */}
      <div className="flex items-center gap-[3px] flex-wrap mb-3">
        <button
          onClick={() => setLetter(null)}
          className="rounded px-[5px] py-[1px] text-[8px] font-mono cursor-pointer"
          style={{
            background: !letter ? "var(--color-a2)" : "var(--color-b2)",
            color: !letter ? "#fff" : "var(--color-t2)",
            border: `1px solid ${!letter ? "var(--color-a2)" : "var(--color-bd)"}`,
          }}
        >
          All
        </button>
        {letters.map(l => (
          <button
            key={l}
            onClick={() => setLetter(letter === l ? null : l)}
            className="rounded px-[5px] py-[1px] text-[8px] font-mono cursor-pointer"
            style={{
              background: letter === l ? "var(--color-a2)" : "var(--color-b2)",
              color: letter === l ? "#fff" : "var(--color-t2)",
              border: `1px solid ${letter === l ? "var(--color-a2)" : "var(--color-bd)"}`,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[7px]">
        {filtered.map((pep, i) => {
          const admin = pep.administrationMethod || pep.route.split(";")[0].trim();
          const summary = pep.shortSummary || pep.description;
          return (
            <BioCard
              key={pep.id}
              className="cursor-pointer transition-colors"
              style={{ animation: `fi 0.15s ${i * 0.02}s both` }}
              onClick={() => router.push(`/peptides/dictionary/${pep.id}`)}
            >
              {/* Name */}
              <div className="flex items-start justify-between gap-1 mb-1">
                <div className="font-semibold text-[12px]" style={{ color: "var(--color-a2)" }}>
                  {pep.name}
                </div>
                <span
                  className="text-[7px] font-mono px-1.5 py-[1px] rounded-sm whitespace-nowrap shrink-0"
                  style={{ background: "rgba(100,181,246,0.08)", color: "var(--color-a2)", border: "1px solid rgba(100,181,246,0.12)" }}
                >
                  {admin}
                </span>
              </div>

              {/* Primary Benefit */}
              {pep.primaryBenefit && (
                <div className="text-[9px] font-medium mb-1" style={{ color: "var(--color-t1)" }}>
                  {pep.primaryBenefit}
                </div>
              )}

              {/* Short Summary */}
              <div
                className="text-[8.5px] leading-relaxed mb-1.5 line-clamp-2"
                style={{ color: "var(--color-t2)" }}
              >
                {summary}
              </div>

              {/* Use Case Tags */}
              {pep.useCases.length > 0 && (
                <div className="flex flex-wrap gap-[3px]">
                  {pep.useCases.slice(0, 3).map(u => (
                    <span
                      key={u}
                      className="text-[7px] font-mono px-1 py-[0.5px] rounded"
                      style={{ background: "rgba(100,181,246,0.06)", color: "var(--color-a2)", border: "1px solid rgba(100,181,246,0.1)" }}
                    >
                      {u}
                    </span>
                  ))}
                  {pep.useCases.length > 3 && (
                    <span className="text-[7px] font-mono" style={{ color: "var(--color-t2)" }}>
                      +{pep.useCases.length - 3}
                    </span>
                  )}
                </div>
              )}
            </BioCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-[10px]" style={{ color: "var(--color-t2)" }}>
          No peptides match your filters.
        </div>
      )}
    </div>
  );
}
