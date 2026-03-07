"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";

export default function TrialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = DB.trials.find((x) => x.id === id);
  if (!t) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Trial not found</div>;

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/trials" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Trials</Link>
        <span className="opacity-30">|</span>
        <span>{t.nctId}</span>
      </div>

      <div className="flex items-center gap-[7px] mb-1.5">
        <h2 className="text-base font-bold font-mono">{t.nctId}</h2>
        <PhaseBadge phase={t.phase} />
        <StatusDot status={t.status} />
      </div>

      <div className="flex gap-1 mb-3.5 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <span className="font-mono">Registry: <span style={{ color: "var(--color-a2)" }}>{t.registry || "ClinicalTrials.gov"}</span></span>
        <span>·</span>
        <span className="font-mono">Synced: <span style={{ color: "var(--color-ac)" }}>{t.lastSynced || "2026-03-04"}</span></span>
        <span>·</span>
        <span>{t.validated !== false ? <span style={{ color: "#00e676" }}>✓ Validated</span> : <span style={{ color: "var(--color-a3)" }}>⚠ Flagged</span>}</span>
      </div>

      {/* Drug / Sponsor / Indication */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[7px] mb-4">
        <BioCard onClick={() => window.location.href = `/drugs/${t.drugId}`}>
          <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Drug</div>
          <div className="text-xs font-semibold" style={{ color: "var(--color-a2)" }}>{t.drugName}</div>
        </BioCard>
        <BioCard onClick={() => window.location.href = `/companies/${t.companyId}`}>
          <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Sponsor</div>
          <div className="text-xs font-semibold" style={{ color: mcTierColor(mcTier(coMap.get(t.companyId)?.marketCap ?? null)) }}>{t.companyName}</div>
        </BioCard>
        <BioCard onClick={() => window.location.href = `/diseases/${encodeURIComponent(t.indication)}`}>
          <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Indication</div>
          <div className="text-xs font-semibold" style={{ color: "var(--color-a2)" }}>{t.indication}</div>
        </BioCard>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[7px]">
        {[
          { l: "Enrollment", v: t.enrollment.toLocaleString() },
          { l: "Endpoint", v: t.endpoint },
          { l: "Start", v: t.startDate },
          { l: "Completion", v: t.estCompletion },
        ].map((s, i) => (
          <BioCard key={i}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{s.l}</div>
            <div className="text-[17px] font-bold font-mono">{s.v}</div>
          </BioCard>
        ))}
      </div>
    </div>
  );
}
