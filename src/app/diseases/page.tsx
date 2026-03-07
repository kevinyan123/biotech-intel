"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DB, IND } from "@/lib/biovault-data";

export default function DiseasesPage() {
  const router = useRouter();
  const data = useMemo(() =>
    IND.map((i) => ({
      n: i,
      dc: DB.drugs.filter((d) => d.indications.includes(i)).length,
      tc: DB.trials.filter((t) => t.indication === i).length,
      cc: new Set(DB.drugs.filter((d) => d.indications.includes(i)).map((d) => d.companyId)).size,
    })).sort((a, b) => b.dc - a.dc),
  []);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-base font-bold mb-2.5">Diseases ({IND.length})</h2>
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 480, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Indication", "Programs", "Companies", "Trials"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.n} onClick={() => router.push(`/diseases/${encodeURIComponent(r.n)}`)} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-semibold" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.n}</td>
                <td className="font-mono font-semibold" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{r.dc}</td>
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
