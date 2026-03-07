"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DB, PH, MOD, TA, mcTier, mcTierColor, riskScore } from "@/lib/biovault-data";

const PP = 50;

export default function CompaniesPage() {
  const router = useRouter();
  const [sort, setSort] = useState("mc");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [tyF, setTyF] = useState<string | null>(null);
  const [coF, setCoF] = useState<string | null>(null);
  const [mcF, setMcF] = useState<string | null>(null);
  const [areaF, setAreaF] = useState<string | null>(null);
  const [hidePvt, setHidePvt] = useState(false);
  const [pg, setPg] = useState(0);

  const countries = useMemo(() => [...new Set(DB.companies.map((c) => c.country))].sort(), []);

  const drugCount = useMemo(() => {
    const m = new Map<string, number>();
    DB.drugs.forEach((d) => m.set(d.companyId, (m.get(d.companyId) || 0) + 1));
    return m;
  }, []);

  const toggleSort = (key: string) => {
    if (sort === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSort(key); setSortDir(key === "nm" || key === "tk" || key === "co" ? "asc" : "desc"); }
    setPg(0);
  };

  const filtered = useMemo(() => {
    let d = DB.companies;
    if (!tyF) d = d.filter((c) => !["cro", "cdmo", "medtech"].includes(c.type));
    if (areaF) d = d.filter((c) => c.therapeuticAreas.includes(areaF));
    if (tyF) d = d.filter((c) => c.type === tyF);
    if (coF) d = d.filter((c) => c.country === coF);
    if (mcF) d = d.filter((c) => mcTier(c.marketCap) === mcF);
    if (hidePvt && !mcF) d = d.filter((c) => c.isPublic);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((c) => c.name.toLowerCase().includes(q) || (c.ticker && c.ticker.toLowerCase().includes(q)));
    }
    const tierOrder: Record<string, number> = { Private: 0, Micro: 1, Small: 2, Mid: 3, Large: 4 };
    const dir = sortDir === "desc" ? -1 : 1;
    return [...d].sort((a, b) => {
      let cmp = 0;
      switch (sort) {
        case "nm": cmp = a.name.localeCompare(b.name); break;
        case "tk": cmp = (a.ticker || "zzz").localeCompare(b.ticker || "zzz"); break;
        case "tr": cmp = (tierOrder[mcTier(a.marketCap)] || 0) - (tierOrder[mcTier(b.marketCap)] || 0); break;
        case "mc": cmp = (a.marketCap || 0) - (b.marketCap || 0); break;
        case "dr": cmp = (drugCount.get(a.id) || 0) - (drugCount.get(b.id) || 0); break;
        case "lt": cmp = riskScore(a).lateStage - riskScore(b).lateStage; break;
        case "ct": cmp = riskScore(a).catalysts - riskScore(b).catalysts; break;
        case "co": cmp = a.country.localeCompare(b.country); break;
        default: cmp = 0;
      }
      return cmp * dir;
    });
  }, [areaF, tyF, coF, mcF, hidePvt, search, sort, sortDir, drugCount]);

  const pgs = Math.ceil(filtered.length / PP);

  const sel = (v: string | null, fn: (v: string | null) => void, l: string, o: string[]) => (
    <select value={v || ""} onChange={(e) => { fn(e.target.value || null); setPg(0); }}
      className="rounded px-[5px] py-[3px] text-[9px] outline-none cursor-pointer"
      style={{ background: "var(--color-b2)", color: v ? "var(--color-ac)" : "var(--color-t2)", border: `1px solid ${v ? "var(--color-ac)33" : "var(--color-bd)"}` }}>
      <option value="">{l}</option>
      {o.map((x) => <option key={x} value={x}>{x}</option>)}
    </select>
  );

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex justify-between items-center mb-2.5 flex-wrap gap-1.5">
        <h2 className="text-base font-bold">Companies <span className="font-normal text-[11px]" style={{ color: "var(--color-t2)" }}>({filtered.length})</span></h2>
        <div className="flex gap-[3px] items-center flex-wrap">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPg(0); }} placeholder="Search…"
            className="rounded px-[7px] py-[3px] text-[9px] outline-none w-[130px]"
            style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }} />
          {sel(tyF, setTyF, "Type", ["biotech", "pharma", "cro", "cdmo", "acad", "gov"])}
          {sel(coF, setCoF, "Country", countries)}
          {sel(mcF, setMcF, "Cap Tier", ["Micro", "Small", "Mid", "Large", "Private"])}
          {sel(areaF, setAreaF, "Area", TA)}
          <button onClick={() => { setHidePvt(!hidePvt); setPg(0); }}
            className="rounded px-1.5 py-[3px] text-[8px] cursor-pointer"
            style={{ background: hidePvt ? "var(--color-b3)" : "transparent", border: `1px solid ${hidePvt ? "var(--color-bd2)" : "var(--color-bd)"}`, color: hidePvt ? "var(--color-ac)" : "var(--color-t2)" }}>
            {hidePvt ? "Public Only" : "Hide Private"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 480, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {([["Company","nm"],["Ticker","tk"],["Tier","tr"],["Cap","mc"],["Drugs","dr"],["Late","lt"],["Cat","ct"],["Country","co"]] as const).map(([h, k]) => (
                <th key={k} onClick={() => toggleSort(k)}
                  className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap cursor-pointer select-none"
                  style={{ padding: "6px 8px", color: sort === k ? "var(--color-ac)" : "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>
                  {h}{sort === k ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(pg * PP, (pg + 1) * PP).map((r) => {
              const tier = mcTier(r.marketCap);
              const rs = riskScore(r);
              const dc = drugCount.get(r.id) || 0;
              return (
                <tr key={r.id} onClick={() => router.push(`/companies/${r.id}`)} className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="font-semibold whitespace-nowrap max-w-[190px] overflow-hidden text-ellipsis" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mcTierColor(tier) }}>{r.name}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>{r.ticker ? <span className="font-mono text-[9px]" style={{ color: "var(--color-a2)" }}>{r.ticker}</span> : "—"}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mcTierColor(tier), fontSize: 9, fontWeight: 600 }}>{tier}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>{r.marketCap ? <span className="font-mono">${r.marketCap}B</span> : "—"}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><span className="font-mono font-bold" style={{ color: "var(--color-ac)" }}>{dc}</span></td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><span className="font-mono font-semibold" style={{ color: rs.lateStage > 0 ? "#00e676" : "var(--color-t2)" }}>{rs.lateStage}</span></td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><span className="font-mono text-[9px]">{rs.catalysts}</span></td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.country}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pgs > 1 && (
        <div className="flex justify-center gap-0.5 mt-2">
          {pg > 0 && <button onClick={() => setPg(pg - 1)} className="font-mono text-[9px] rounded px-1.5 py-0.5" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>←</button>}
          {Array.from({ length: Math.min(pgs, 8) }, (_, i) => {
            const pn = pgs <= 8 ? i : pg < 4 ? i : pg > pgs - 5 ? pgs - 8 + i : pg - 3 + i;
            return <button key={pn} onClick={() => setPg(pn)} className="font-mono text-[9px] rounded px-1.5 py-0.5 font-semibold min-w-[24px]"
              style={{ background: pg === pn ? "var(--color-ac)" : "var(--color-b2)", color: pg === pn ? "var(--color-b0)" : "var(--color-t2)", border: "1px solid var(--color-bd)" }}>{pn + 1}</button>;
          })}
          {pg < pgs - 1 && <button onClick={() => setPg(pg + 1)} className="font-mono text-[9px] rounded px-1.5 py-0.5" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>→</button>}
          <span className="text-[9px] px-1 py-0.5" style={{ color: "var(--color-t2)" }}>/{pgs}</span>
        </div>
      )}
    </div>
  );
}
