"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  relativeTime,
  daysUntil,
  readoutConfidenceColor,
} from "@/lib/catalyst-utils";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";

interface TrialDetail {
  nctId: string;
  title: string;
  phase: string;
  status: string;
  indication: string | null;
  conditions: string[];
  drugName: string | null;
  interventions: { name: string; type: string }[];
  companyId: number | null;
  companyName: string | null;
  enrollment: number | null;
  studyType: string | null;
  startDate: string | null;
  primaryCompletionDate: string | null;
  completionDate: string | null;
  readoutDate: string | null;
  readoutConfidence: string;
  readoutSource: string | null;
  readoutSourceTier: number | null;
  resultsAvailable: boolean;
  briefSummary: string | null;
  locations: string[];
  lastSyncedAt: string | null;
}

export default function TrialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [t, setT] = useState<TrialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/trials/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setT(data);
        }
      })
      .catch(() => setError("Network error — could not load trial"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-[11px]" style={{ color: "var(--color-t2)" }}>
        Loading trial…
      </div>
    );
  }

  if (error || !t) {
    return (
      <div className="p-10 text-center">
        <div className="text-[11px] mb-2" style={{ color: "#ff6b6b" }}>
          {error ?? "Trial not found"}
        </div>
        <Link href="/trials" className="text-[10px] hover:underline" style={{ color: "var(--color-ac)" }}>
          ← Back to Trials
        </Link>
      </div>
    );
  }

  // Progress calculation
  const estCompletion = t.completionDate;
  const hasCompletion = !!estCompletion;
  const startMs = t.startDate ? new Date(t.startDate).getTime() : 0;
  const endMs = hasCompletion ? new Date(estCompletion!).getTime() : 0;
  const nowMs = Date.now();
  const totalDuration = hasCompletion ? Math.max(1, endMs - startMs) : 1;
  const elapsed = nowMs - startMs;
  const progressPct = startMs && hasCompletion ? Math.max(0, Math.min(100, (elapsed / totalDuration) * 100)) : 0;
  const daysRemaining = hasCompletion ? daysUntil(estCompletion!) : null;
  const isCompleted = t.status === "Completed";
  const isTerminated = t.status === "Terminated";

  // Last synced display
  const syncedDisplay = t.lastSyncedAt
    ? new Date(t.lastSyncedAt).toISOString().slice(0, 10)
    : "—";

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

      {/* Title */}
      <div className="text-[11px] mb-2.5 leading-snug" style={{ color: "var(--color-t1)" }}>
        {t.title}
      </div>

      <div className="flex gap-1 mb-3.5 text-[9px] flex-wrap" style={{ color: "var(--color-t2)" }}>
        <span className="font-mono">Registry: <span style={{ color: "var(--color-a2)" }}>ClinicalTrials.gov</span></span>
        <span>·</span>
        <span className="font-mono">Synced: <span style={{ color: "var(--color-ac)" }}>{syncedDisplay}</span></span>
        <span>·</span>
        <span>
          {t.resultsAvailable ? (
            <span style={{ color: "#00e676" }}>✓ Results Available</span>
          ) : (
            <span style={{ color: "var(--color-t2)" }}>No results yet</span>
          )}
        </span>
      </div>

      {/* Drug / Sponsor / Indication */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[7px] mb-4">
        <BioCard>
          <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Drug</div>
          <div className="text-xs font-semibold" style={{ color: "var(--color-a2)" }}>
            {t.drugName ?? "—"}
          </div>
        </BioCard>
        <BioCard
          onClick={t.companyId ? () => { window.location.href = `/companies/${t.companyId}`; } : undefined}
        >
          <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Sponsor</div>
          <div className="text-xs font-semibold" style={{ color: "var(--color-t0)" }}>{t.companyName ?? "—"}</div>
        </BioCard>
        {t.indication && (
          <BioCard
            onClick={() => { window.location.href = `/diseases/${encodeURIComponent(t.indication!)}`; }}
          >
            <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>Indication</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-a2)" }}>{t.indication}</div>
          </BioCard>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[7px] mb-4">
        {[
          {
            l: "Enrollment",
            v: t.enrollment != null ? t.enrollment.toLocaleString() : "—",
          },
          {
            l: "Study Type",
            v: t.studyType ?? "—",
          },
          {
            l: "Start",
            v: t.startDate ?? "—",
            rel: t.startDate ? relativeTime(t.startDate) : undefined,
            relColor: "var(--color-a2)",
          },
          {
            l: "Completion",
            v: estCompletion ?? "TBD",
            rel: estCompletion
              ? relativeTime(estCompletion)
              : "Not determined",
            relColor: !estCompletion
              ? "#ff6b6b"
              : daysRemaining != null && daysRemaining > 0
              ? "var(--color-ac)"
              : "#64b5f6",
          },
          {
            l: "Data Readout",
            v: t.readoutDate ?? "Unknown",
            rel:
              t.readoutConfidence === "confirmed" && t.readoutDate
                ? relativeTime(t.readoutDate)
                : t.readoutConfidence === "estimated"
                ? "Estimated"
                : "No reliable source",
            relColor: readoutConfidenceColor(t.readoutConfidence),
          },
        ].map((s, i) => (
          <BioCard key={i}>
            <div
              className="text-[8px] font-semibold uppercase tracking-wide mb-0.5 font-mono"
              style={{ color: "var(--color-t2)" }}
            >
              {s.l}
            </div>
            <div className="text-[17px] font-bold font-mono">{s.v}</div>
            {s.rel && (
              <div className="text-[10px] font-mono mt-0.5" style={{ color: s.relColor }}>
                {s.rel}
              </div>
            )}
          </BioCard>
        ))}
      </div>

      {/* Source Provenance */}
      {t.readoutSource && (
        <div className="text-[9px] font-mono mb-3 -mt-2" style={{ color: "var(--color-t2)" }}>
          Readout Source:{" "}
          <span style={{ color: readoutConfidenceColor(t.readoutConfidence) }}>
            {t.readoutSource}
          </span>
          {t.readoutSourceTier && (
            <span
              className="ml-1.5 px-1 py-px rounded text-[7px]"
              style={{
                background: `${readoutConfidenceColor(t.readoutConfidence)}15`,
                color: readoutConfidenceColor(t.readoutConfidence),
                border: `1px solid ${readoutConfidenceColor(t.readoutConfidence)}30`,
              }}
            >
              Tier {t.readoutSourceTier}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {startMs > 0 && (
        <BioCard className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[8px] font-semibold uppercase tracking-wide font-mono"
              style={{ color: "var(--color-t2)" }}
            >
              Trial Progress
            </span>
            <span
              className="text-[10px] font-mono font-semibold"
              style={{
                color: isCompleted
                  ? "#64b5f6"
                  : isTerminated
                  ? "#ff6b6b"
                  : !hasCompletion
                  ? "#ff6b6b"
                  : "var(--color-ac)",
              }}
            >
              {isCompleted
                ? "Completed"
                : isTerminated
                ? t.status
                : !hasCompletion
                ? "Completion TBD"
                : daysRemaining != null && daysRemaining > 0
                ? `${daysRemaining}d remaining`
                : `${Math.abs(daysRemaining!)}d past est. completion`}
            </span>
          </div>
          <div
            className="relative h-[10px] rounded-full overflow-hidden"
            style={{ background: "var(--color-b3)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${isCompleted ? 100 : progressPct}%`,
                background: isCompleted
                  ? "linear-gradient(90deg, #64b5f644, #64b5f6)"
                  : isTerminated
                  ? `repeating-linear-gradient(90deg, #ff6b6b44 0, #ff6b6b44 4px, #ff6b6b22 4px, #ff6b6b22 8px)`
                  : `linear-gradient(90deg, var(--color-ac)33, var(--color-ac))`,
              }}
            />
            {!isCompleted && !isTerminated && progressPct > 0 && progressPct < 100 && (
              <div
                className="absolute top-[-2px] bottom-[-2px] w-[2px] rounded"
                style={{
                  left: `${progressPct}%`,
                  background: "var(--color-ac)",
                  boxShadow: "0 0 4px var(--color-ac)",
                }}
              />
            )}
          </div>
          <div
            className="flex justify-between mt-1 text-[8px] font-mono"
            style={{ color: "var(--color-t2)" }}
          >
            <span>{t.startDate}</span>
            <span className="font-semibold" style={{ color: "var(--color-ac)", opacity: 0.6 }}>
              {Math.round(progressPct)}%
            </span>
            <span>{estCompletion ?? "TBD"}</span>
          </div>
        </BioCard>
      )}

      {/* Brief Summary */}
      {t.briefSummary && (
        <BioCard className="mb-3">
          <div
            className="text-[8px] font-semibold uppercase tracking-wide mb-1 font-mono"
            style={{ color: "var(--color-t2)" }}
          >
            Brief Summary
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-t1)" }}>
            {t.briefSummary}
          </p>
        </BioCard>
      )}

      {/* Conditions & Locations */}
      {(t.conditions.length > 1 || t.locations.length > 0) && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[7px]">
          {t.conditions.length > 1 && (
            <BioCard>
              <div
                className="text-[8px] font-semibold uppercase tracking-wide mb-1 font-mono"
                style={{ color: "var(--color-t2)" }}
              >
                Conditions ({t.conditions.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {t.conditions.slice(0, 6).map((c) => (
                  <span
                    key={c}
                    className="text-[8px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(100,181,246,0.08)",
                      border: "1px solid rgba(100,181,246,0.15)",
                      color: "var(--color-a2)",
                    }}
                  >
                    {c}
                  </span>
                ))}
                {t.conditions.length > 6 && (
                  <span className="text-[8px]" style={{ color: "var(--color-t2)" }}>
                    +{t.conditions.length - 6} more
                  </span>
                )}
              </div>
            </BioCard>
          )}
          {t.locations.length > 0 && (
            <BioCard>
              <div
                className="text-[8px] font-semibold uppercase tracking-wide mb-1 font-mono"
                style={{ color: "var(--color-t2)" }}
              >
                Locations ({t.locations.length})
              </div>
              <div className="text-[9px] leading-relaxed" style={{ color: "var(--color-t1)" }}>
                {t.locations.slice(0, 5).join(" · ")}
                {t.locations.length > 5 && (
                  <span style={{ color: "var(--color-t2)" }}> +{t.locations.length - 5} more</span>
                )}
              </div>
            </BioCard>
          )}
        </div>
      )}
    </div>
  );
}
