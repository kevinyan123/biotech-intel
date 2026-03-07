"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DB, PH, MOD, TA, pC, mcTier, mcTierColor } from "@/lib/biovault-data";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import PhaseBadge from "@/components/ui/PhaseBadge";

const PP = 50;

export default function PipelinePage() {
  const router = useRouter();
  const [vm, setVm] = useState<"table" | "heatmap">("table");
  const [phaseF, setPhaseF] = useState<string | null>(null);
  const [modF, setModF] = useState<string | null>(null);
  const [areaF, setAreaF] = useState<string | null>(null);
  const [pg, setPg] = useState(0);

  const fd = useMemo(() => {
    let d = DB.drugs;
    if (phaseF) d = d.filter((x) => x.phase === phaseF);
    if (modF) d = d.filter((x) => x.modality === modF);
    if (areaF) {
      const cos = new Set(DB.companies.filter((c) => c.therapeuticAreas.includes(areaF)).map((c) => c.id));
      d = d.filter((x) => cos.has(x.companyId));
    }
    return d;
  }, [phaseF, modF, areaF]);

  const pgs = Math.ceil(fd.length / PP);

  const sel = (v: string | null, fn: (v: string | null) => void, l: string, o: readonly string[]) => (
    <select value={v || ""} onChange={(e) => { fn(e.target.value || null); setPg(0); }}
      className="rounded px-[6px] py-[3px] text-[9px] outline-none cursor-pointer"
      style={{ background: "var(--color-b2)", color: v ? "var(--color-ac)" : "var(--color-t2)", border: `1px solid ${v ? "var(--color-ac)33" : "var(--color-bd)"}` }}>
      <option value="">{l}</option>
      {o.map((x) => <option key={x} value={x}>{x}</option>)}
    </select>
  );

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex justify-between items-center mb-2.5">
        <h2 className="text-base font-bold">Pipeline <span className="font-normal text-[11px]" style={{ color: "var(--color-t2)" }}>({fd.length})</span></h2>
        <div className="flex gap-0.5">
          {(["table", "heatmap"] as const).map((m) => (
            <button key={m} onClick={() => setVm(m)} className="rounded px-1.5 py-0.5 text-[9px] cursor-pointer capitalize"
              style={{ background: vm === m ? "var(--color-b3)" : "transparent", border: `1px solid ${vm === m ? "var(--color-bd2)" : "var(--color-bd)"}`, color: vm === m ? "var(--color-t0)" : "var(--color-t2)" }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap mb-2.5">
        {sel(phaseF, setPhaseF, "Phase", PH)}
        {sel(modF, setModF, "Modality", MOD)}
        {sel(areaF, setAreaF, "Area", TA)}
        {(phaseF || modF || areaF) && (
          <button onClick={() => { setPhaseF(null); setModF(null); setAreaF(null); }}
            className="rounded px-1.5 py-[3px] text-[9px] cursor-pointer"
            style={{ background: "var(--color-rd)15", color: "var(--color-rd)", border: "1px solid var(--color-rd)25" }}>
            Clear
          </button>
        )}
      </div>

      {vm === "table" ? (
        <>
          <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 460, overflowY: "auto" }}>
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
                  {["Drug", "Company", "Phase", "Trials", "Target", "MOA", "Src"].map((h) => (
                    <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                      style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fd.slice(pg * PP, (pg + 1) * PP).map((r) => (
                  <tr key={r.id} onClick={() => router.push(`/drugs/${r.id}`)} className="cursor-pointer transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.name || r.code}</td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <Link href={`/companies/${r.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(r.companyId)?.marketCap ?? null)) }}>{r.companyName}</Link>
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.highestPhase || r.phase} /></td>
                    <td className="font-mono text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{r.trialCount || "—"}</td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                      <Link href={`/targets/${encodeURIComponent(r.target)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{r.target}</Link>
                    </td>
                    <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{r.moa}</td>
                    <td className="text-[7px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>{r.source === "company_disclosure" ? "Co" : "Trial"}</td>
                  </tr>
                ))}
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
            </div>
          )}
        </>
      ) : (
        /* Heatmap View */
        <div className="rounded-lg p-3" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
          <div className="text-[9px] font-semibold mb-1.5" style={{ color: "var(--color-t2)" }}>Modality × Phase</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-[3px_5px] text-[7px] font-mono" style={{ color: "var(--color-t2)" }}>Modality</th>
                  {PH.map((p) => (
                    <th key={p} className="p-[3px] text-[6px] font-mono text-center" style={{ color: "var(--color-t2)" }}>
                      {p.replace("Phase ", "P").replace("Preclinical", "Pre").replace("NDA/BLA", "NDA").replace("Approved", "App")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOD.slice(0, 14).map((mod) => (
                  <tr key={mod}>
                    <td className="p-[2px_5px] text-[8px] whitespace-nowrap" style={{ color: "var(--color-t1)" }}>{mod}</td>
                    {PH.map((ph) => {
                      const n = fd.filter((d) => d.modality === mod && d.phase === ph).length;
                      const int = Math.min(1, n / 15);
                      return (
                        <td key={ph} className="p-[1px] text-center">
                          <div className="w-6 h-[18px] rounded-sm flex items-center justify-center text-[8px] font-semibold font-mono mx-auto"
                            style={{ background: n > 0 ? `rgba(0,223,162,${0.04 + int * 0.32})` : "var(--color-b2)", color: n > 0 ? "var(--color-ac)" : "var(--color-t2)" }}>
                            {n || "·"}
                          </div>
                        </td>
                      );
                    })}
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
