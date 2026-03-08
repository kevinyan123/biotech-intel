"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DB, PH, STS, mcTier, mcTierColor } from "@/lib/biovault-data";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";

const PP = 50;

export default function TrialsPage() {
  const router = useRouter();
  const [phaseF, setPhaseF] = useState<string | null>(null);
  const [statusF, setStatusF] = useState<string | null>(null);
  const [pg, setPg] = useState(0);

  const fd = useMemo(() => {
    let d = DB.trials;
    if (phaseF) d = d.filter((t) => t.phase === phaseF);
    if (statusF) d = d.filter((t) => t.status === statusF);
    return d;
  }, [phaseF, statusF]);

  const pgs = Math.ceil(fd.length / PP);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-base font-bold mb-2.5">
        Trials <span className="font-normal text-[11px]" style={{ color: "var(--color-t2)" }}>({fd.length})</span>
      </h2>

      <div className="flex gap-[3px] mb-2 flex-wrap">
        <select value={phaseF || ""} onChange={(e) => { setPhaseF(e.target.value || null); setPg(0); }}
          className="rounded px-[6px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{ background: "var(--color-b2)", color: phaseF ? "var(--color-ac)" : "var(--color-t2)", border: `1px solid ${phaseF ? "var(--color-ac)33" : "var(--color-bd)"}` }}>
          <option value="">Phase</option>
          {PH.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {STS.map((s) => (
          <button key={s} onClick={() => { setStatusF(statusF === s ? null : s); setPg(0); }}
            className="rounded px-[5px] py-[2px] text-[8px] cursor-pointer"
            style={{ background: statusF === s ? "var(--color-b3)" : "transparent", border: `1px solid ${statusF === s ? "var(--color-bd2)" : "var(--color-bd)"}`, color: statusF === s ? "var(--color-t0)" : "var(--color-t2)" }}>
            {s.length > 12 ? s.slice(0, 10) + "…" : s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 460, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["NCT", "Drug", "Company", "Phase", "Indication", "Status", "Readout", "N", "Registry", "✓"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fd.slice(pg * PP, (pg + 1) * PP).map((r) => (
              <tr key={r.id} onClick={() => router.push(`/trials/${r.id}`)} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{r.nctId}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", whiteSpace: "nowrap" }}>
                  <Link href={`/drugs/${r.drugId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{r.drugName}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <Link href={`/companies/${r.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(r.companyId)?.marketCap ?? null)) }}>{r.companyName}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.phase} small /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 100 }}>
                  <Link href={`/diseases/${encodeURIComponent(r.indication)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{r.indication}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><StatusDot status={r.status} /></td>
                <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: r.readoutEstimated ? "#ffab66" : "#64b5f6" }}>
                  {r.readoutDate}{r.readoutEstimated ? " ᴱ" : ""}
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.enrollment}</td>
                <td className="text-[8px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>{(r.registry || "CT.gov").replace("ClinicalTrials.gov", "CT.gov")}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  {r.validated !== false ? <span className="text-[9px]" style={{ color: "#00e676" }}>✓</span> : <span className="text-[9px]" style={{ color: "var(--color-a3)" }}>⚠</span>}
                </td>
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
    </div>
  );
}
