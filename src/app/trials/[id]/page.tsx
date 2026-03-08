"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";
import { relativeTime, daysUntil, readoutConfidenceColor, readoutConfidenceLabel } from "@/lib/catalyst-utils";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";

export default function TrialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = DB.trials.find((x) => x.id === id);
  if (!t) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Trial not found</div>;

  // Progress calculation
  const hasCompletion = !!t.estCompletion;
  const startMs = new Date(t.startDate).getTime();
  const endMs = hasCompletion ? new Date(t.estCompletion!).getTime() : 0;
  const nowMs = new Date().getTime();
  const totalDuration = hasCompletion ? Math.max(1, endMs - startMs) : 1;
  const elapsed = nowMs - startMs;
  const progressPct = hasCompletion ? Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)) : 0;
  const daysRemaining = hasCompletion ? daysUntil(t.estCompletion!) : null;
  const isCompleted = t.status === "Completed";
  const isTerminated = t.status === "Terminated" || t.status === "Withdrawn";

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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[7px] mb-4">
        {[
          { l: "Enrollment", v: t.enrollment.toLocaleString() },
          { l: "Endpoint", v: t.endpoint },
          { l: "Start", v: t.startDate, rel: relativeTime(t.startDate), relColor: "var(--color-a2)" },
          { l: "Completion", v: t.estCompletion || "TBD",
            rel: t.estCompletion ? relativeTime(t.estCompletion) : "Not determined",
            relColor: !t.estCompletion ? "#ff6b6b" : (daysRemaining && daysRemaining > 0) ? "var(--color-ac)" : "#64b5f6" },
          { l: "Data Readout", v: t.readoutDate || "Unknown",
            rel: t.readoutConfidence === "confirmed" && t.readoutDate ? relativeTime(t.readoutDate)
               : t.readoutConfidence === "estimated" ? "Estimated"
               : "No reliable source",
            relColor: readoutConfidenceColor(t.readoutConfidence) },
        ].map((s, i) => (
          <BioCard key={i}>
            <div className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono" style={{ color: "var(--color-t2)" }}>{s.l}</div>
            <div className="text-[17px] font-bold font-mono">{s.v}</div>
            {s.rel && (
              <div className="text-[10px] font-mono mt-0.5" style={{ color: s.relColor }}>{s.rel}</div>
            )}
          </BioCard>
        ))}
      </div>

      {/* Source Provenance */}
      {t.readoutSource && (
        <div className="text-[9px] font-mono mb-3 -mt-2" style={{ color: "var(--color-t2)" }}>
          Readout Source: <span style={{ color: readoutConfidenceColor(t.readoutConfidence) }}>{t.readoutSource}</span>
          {t.readoutSourceTier && (
            <span className="ml-1.5 px-1 py-px rounded text-[7px]"
              style={{
                background: `${readoutConfidenceColor(t.readoutConfidence)}15`,
                color: readoutConfidenceColor(t.readoutConfidence),
                border: `1px solid ${readoutConfidenceColor(t.readoutConfidence)}30`,
              }}>
              Tier {t.readoutSourceTier}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <BioCard className="mb-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8px] font-semibold uppercase tracking-wide font-mono" style={{ color: "var(--color-t2)" }}>Trial Progress</span>
          <span className="text-[10px] font-mono font-semibold" style={{
            color: isCompleted ? "#64b5f6" : isTerminated ? "#ff6b6b" : !hasCompletion ? "#ff6b6b" : "var(--color-ac)",
          }}>
            {isCompleted ? "Completed" : isTerminated ? t.status : !hasCompletion ? "Completion TBD" : daysRemaining! > 0 ? `${daysRemaining}d remaining` : `${Math.abs(daysRemaining!)}d past est. completion`}
          </span>
        </div>
        <div className="relative h-[10px] rounded-full overflow-hidden" style={{ background: "var(--color-b3)" }}>
          <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{
            width: `${isCompleted ? 100 : isTerminated ? progressPct : progressPct}%`,
            background: isCompleted
              ? "linear-gradient(90deg, #64b5f644, #64b5f6)"
              : isTerminated
              ? `repeating-linear-gradient(90deg, #ff6b6b44 0, #ff6b6b44 4px, #ff6b6b22 4px, #ff6b6b22 8px)`
              : `linear-gradient(90deg, var(--color-ac)33, var(--color-ac))`,
          }} />
          {/* Today marker */}
          {!isCompleted && !isTerminated && progressPct > 0 && progressPct < 100 && (
            <div className="absolute top-[-2px] bottom-[-2px] w-[2px] rounded" style={{
              left: `${progressPct}%`, background: "var(--color-ac)",
              boxShadow: "0 0 4px var(--color-ac)",
            }} />
          )}
        </div>
        <div className="flex justify-between mt-1 text-[8px] font-mono" style={{ color: "var(--color-t2)" }}>
          <span>{t.startDate}</span>
          <span className="font-semibold" style={{ color: "var(--color-ac)", opacity: 0.6 }}>{Math.round(progressPct)}%</span>
          <span>{t.estCompletion || "TBD"}</span>
        </div>
      </BioCard>
    </div>
  );
}
