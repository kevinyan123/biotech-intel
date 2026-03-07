"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DB, TGT } from "@/lib/biovault-data";

export default function TargetsPage() {
  const router = useRouter();
  const data = useMemo(() => {
    // Pre-build lookup: drugId -> target
    const drugTarget = new Map<string, string>();
    DB.drugs.forEach((d) => drugTarget.set(d.id, d.target));
    // Pre-count trials per target
    const trialsByTarget = new Map<string, number>();
    DB.trials.forEach((t) => {
      const tgt = drugTarget.get(t.drugId);
      if (tgt) trialsByTarget.set(tgt, (trialsByTarget.get(tgt) || 0) + 1);
    });
    return TGT.map((t) => {
      const drugs = DB.drugs.filter((d) => d.target === t);
      return {
        n: t,
        dc: drugs.length,
        cc: new Set(drugs.map((d) => d.companyId)).size,
        tc: trialsByTarget.get(t) || 0,
      };
    }).sort((a, b) => b.dc - a.dc);
  }, []);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-base font-bold mb-2.5">Targets ({TGT.length})</h2>
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 480, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Target", "Programs", "Companies", "Trials"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.n} onClick={() => router.push(`/targets/${encodeURIComponent(r.n)}`)} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-bold font-mono" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{r.n}</td>
                <td className="font-mono font-semibold" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.dc}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.cc}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.tc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
