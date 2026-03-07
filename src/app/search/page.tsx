"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { DB, IND, TGT } from "@/lib/biovault-data";
import PhaseBadge from "@/components/ui/PhaseBadge";

export default function SearchPage() {
  const [sq, setSq] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const h = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const sr = useMemo(() => {
    if (!sq || sq.length < 2) return [];
    const q = sq.toLowerCase();
    const r: { ty: string; lb: string; sb: string; href: string }[] = [];
    DB.companies.filter((c) => c.name.toLowerCase().includes(q) || (c.ticker && c.ticker.toLowerCase().includes(q))).slice(0, 6).forEach((c) =>
      r.push({ ty: "company", lb: c.name, sb: `${c.ticker || c.fundingStatus} · ${c.country}`, href: `/companies/${c.id}` })
    );
    DB.drugs.filter((d) => (d.name && d.name.toLowerCase().includes(q)) || d.code.toLowerCase().includes(q)).slice(0, 4).forEach((d) =>
      r.push({ ty: "drug", lb: d.name || d.code, sb: `${d.companyName} · ${d.phase}`, href: `/drugs/${d.id}` })
    );
    DB.trials.filter((t) => t.nctId.toLowerCase().includes(q)).slice(0, 3).forEach((t) =>
      r.push({ ty: "trial", lb: t.nctId, sb: t.drugName || t.drugCode, href: `/trials/${t.id}` })
    );
    IND.filter((i) => i.toLowerCase().includes(q)).slice(0, 3).forEach((i) =>
      r.push({ ty: "disease", lb: i, sb: "Indication", href: `/diseases/${encodeURIComponent(i)}` })
    );
    TGT.filter((t) => t.toLowerCase().includes(q)).slice(0, 3).forEach((t) =>
      r.push({ ty: "target", lb: t, sb: "Target", href: `/targets/${encodeURIComponent(t)}` })
    );
    return r;
  }, [sq]);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-base font-bold mb-3">Search</h2>

      <div className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] mb-4"
        style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd2)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-t2)" }}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          value={sq}
          onChange={(e) => setSq(e.target.value)}
          placeholder="Search companies, drugs, targets, diseases…"
          className="flex-1 bg-transparent border-none outline-none text-xs"
          style={{ color: "var(--color-t0)" }}
        />
      </div>

      {sr.length === 0 && sq.length >= 2 && (
        <div className="py-[18px] text-center text-[10px]" style={{ color: "var(--color-t2)" }}>No results</div>
      )}

      {sr.map((r, i) => (
        <Link key={i} href={r.href}
          className="flex items-center gap-2 px-3 py-1.5 transition-colors rounded"
          style={{ borderBottom: "1px solid var(--color-bd)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <span className="opacity-50" style={{ color: "var(--color-ac)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{r.lb}</div>
            <div className="text-[8px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: "var(--color-t2)" }}>{r.sb}</div>
          </div>
          <span className="text-[7px] uppercase font-mono tracking-wide" style={{ color: "var(--color-t2)" }}>{r.ty}</span>
        </Link>
      ))}

      {sq.length < 2 && (
        <div className="p-3">
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--color-t2)" }}>Quick</div>
          {["Eli Lilly", "Moderna", "PD-1", "KRAS", "Alzheimer's", "Gene Therapy", "NASH", "CAR-T", "Obesity", "Phase 3"].map((l, i) => (
            <div key={i} className="py-[3px] text-[10px] cursor-pointer hover:text-[var(--color-ac)] transition-colors"
              style={{ color: "var(--color-t1)" }}
              onClick={() => setSq(l.split(" ")[0].toLowerCase())}>
              → {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
