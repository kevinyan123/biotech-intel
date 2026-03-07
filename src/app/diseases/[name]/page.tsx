"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DiseaseDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const nm = decodeURIComponent(name);
  const dr = DB.drugs.filter((d) => d.indications.includes(nm));
  const tr = DB.trials.filter((t) => t.indication === nm);
  const cs = [...new Set(dr.map((d) => d.companyId))];
  const moas = [...new Set(dr.map((d) => d.moa))];

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/diseases" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Diseases</Link>
        <span className="opacity-30">|</span>
        <span>{nm}</span>
      </div>

      <h2 className="text-lg font-bold mb-0.5">{nm}</h2>
      <p className="text-[10px] mb-3.5" style={{ color: "var(--color-t2)" }}>{dr.length} programs · {cs.length} companies</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[7px] mb-3.5">
        <BioCard><div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>Programs</div><div className="text-[17px] font-bold font-mono" style={{ color: "var(--color-ac)" }}>{dr.length}</div></BioCard>
        <BioCard><div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>Companies</div><div className="text-[17px] font-bold font-mono">{cs.length}</div></BioCard>
        <BioCard><div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>Trials</div><div className="text-[17px] font-bold font-mono">{tr.length}</div></BioCard>
        <BioCard><div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>MOAs</div><div className="text-[17px] font-bold font-mono">{moas.length}</div></BioCard>
      </div>

      <div className="flex gap-0.5 mb-3 flex-wrap">
        {moas.slice(0, 10).map((m, i) => <Tag key={i} color="var(--color-a3)">{m}</Tag>)}
      </div>

      <SectionHeader>Drugs</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-3" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Drug", "Company", "Phase", "Target", "MOA"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dr.map((r) => (
              <tr key={r.id} onClick={() => window.location.href = `/drugs/${r.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.name || r.code}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <Link href={`/companies/${r.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(r.companyId)?.marketCap ?? null)) }}>{r.companyName}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.phase} small /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <Link href={`/targets/${encodeURIComponent(r.target)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{r.target}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{r.moa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader>Trials ({tr.length})</SectionHeader>
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 260, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["NCT", "Drug", "Phase", "Status"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tr.slice(0, 20).map((t) => (
              <tr key={t.id} onClick={() => window.location.href = `/trials/${t.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{t.nctId}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <Link href={`/drugs/${t.drugId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{t.drugName}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={t.phase} small /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><StatusDot status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
