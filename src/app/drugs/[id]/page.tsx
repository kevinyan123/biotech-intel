"use client";

import { use } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";
import { milestoneColor, relativeTime, daysUntil } from "@/lib/catalyst-utils";

const coMap = new Map(DB.companies.map((c) => [c.id, c]));
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";

export default function DrugDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const d = DB.drugs.find((x) => x.id === id);
  if (!d) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Drug not found</div>;

  const tr = DB.trials.filter((t) => t.drugId === id);
  const comp = DB.drugs.filter((x) => x.id !== id && (x.target === d.target || x.moa === d.moa)).slice(0, 10);
  const cat = DB.catalysts.filter((c) => c.drugId === id);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/drugs" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Pipeline</Link>
        <span className="opacity-30">|</span>
        <span>{d.name || d.code}</span>
      </div>

      <div className="mb-3.5">
        <div className="flex items-center gap-[7px] mb-0.5">
          <h2 className="text-lg font-bold">{d.name || d.code}</h2>
          <PhaseBadge phase={d.highestPhase || d.phase} />
        </div>
        {d.name && <div className="text-[10px] font-mono" style={{ color: "var(--color-t2)" }}>{d.code}</div>}
        <div className="text-[10px] mt-0.5" style={{ color: "var(--color-t2)" }}>
          By <Link href={`/companies/${d.companyId}`} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(d.companyId)?.marketCap ?? null)) }}>{d.companyName}</Link>
        </div>
        {d.aliases && d.aliases.length > 0 && (
          <div className="text-[9px] mt-1" style={{ color: "var(--color-t2)" }}>
            Aliases: {d.aliases.map((a, i) => <Tag key={i} color="var(--color-t2)">{a}</Tag>)}
          </div>
        )}
        <div className="flex gap-2 mt-1 text-[9px]" style={{ color: "var(--color-t2)" }}>
          <span>Source: <span style={{ color: "var(--color-a2)" }}>{d.source === "company_disclosure" ? "Company Disclosure" : "Trial-derived"}</span></span>
          <span>·</span>
          <span>Trials: <span className="font-mono font-semibold" style={{ color: "var(--color-ac)" }}>{d.trialCount || tr.length}</span></span>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[7px] mb-3.5">
        {[
          { l: "Modality", v: d.modality },
          { l: "MOA", v: d.moa },
          { l: "Target", v: d.target, link: `/targets/${encodeURIComponent(d.target)}` },
          { l: "Pathway", v: d.pathway },
        ].map((p, i) => (
          <BioCard key={i} onClick={p.link ? () => window.location.href = p.link! : undefined}>
            <div className="text-[7px] font-semibold uppercase mb-0.5" style={{ color: "var(--color-t2)" }}>{p.l}</div>
            <div className="text-[11px] font-semibold" style={{ color: p.link ? "var(--color-a2)" : "var(--color-t0)" }}>{p.v}</div>
          </BioCard>
        ))}
      </div>

      <div className="flex gap-0.5 mb-3 flex-wrap">
        {(d.allIndications || d.indications).map((x, i) => <Tag key={i} color="var(--color-a2)">{x}</Tag>)}
      </div>

      {/* Development Pipeline */}
      {(() => {
        const STAGES = [
          { key: "Preclinical", label: "Preclinical", short: "Pre" },
          { key: "Phase 1", label: "Phase 1", short: "P1" },
          { key: "Phase 2", label: "Phase 2", short: "P2" },
          { key: "Phase 3", label: "Phase 3", short: "P3" },
          { key: "NDA/BLA", label: "NDA/BLA", short: "NDA" },
          { key: "Approved", label: "Approved", short: "App" },
        ];

        // Map any phase string to its pipeline stage index
        const stageIndex = (ph: string): number => {
          if (ph === "Approved") return 5;
          if (ph === "NDA/BLA") return 4;
          if (ph === "Phase 3") return 3;
          if (ph === "Phase 2/3" || ph === "Phase 2") return 2;
          if (ph === "Phase 1/2" || ph === "Phase 1") return 1;
          return 0; // Preclinical
        };

        const currentPhase = d.highestPhase || d.phase;
        const currentIdx = stageIndex(currentPhase);

        // Map trials to pipeline stages for tooltip data
        const trialsByStage: Record<number, typeof tr> = {};
        tr.forEach((t) => {
          const idx = stageIndex(t.phase);
          if (!trialsByStage[idx]) trialsByStage[idx] = [];
          trialsByStage[idx].push(t);
        });

        // Get earliest year for each stage that has trials
        const stageYears: Record<number, string> = {};
        Object.entries(trialsByStage).forEach(([idx, trials]) => {
          const earliest = trials.reduce((best, t) => t.startDate < best ? t.startDate : best, trials[0].startDate);
          // startDate is YYYY-MM format
          stageYears[Number(idx)] = earliest.split("-")[0];
        });

        return (
          <>
            <SectionHeader>Development Pipeline</SectionHeader>
            <BioCard className="mb-3.5">
              <div className="flex items-center justify-between relative px-2 py-3">
                {/* Connecting line behind everything */}
                <div className="absolute top-1/2 left-[24px] right-[24px] h-[2px] -translate-y-[5px]" style={{ background: "var(--color-bd)" }}>
                  {/* Filled portion up to current stage */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, height: "100%",
                    width: `${(currentIdx / (STAGES.length - 1)) * 100}%`,
                    background: "linear-gradient(90deg, #546e7a, #4fc3f7)",
                    borderRadius: 1,
                  }} />
                </div>

                {STAGES.map((stage, i) => {
                  const isCompleted = i < currentIdx;
                  const isCurrent = i === currentIdx;
                  const isFuture = i > currentIdx;
                  const trials = trialsByStage[i] || [];
                  const year = stageYears[i];

                  // Aggregate tooltip data
                  const totalEnrollment = trials.reduce((sum, t) => sum + t.enrollment, 0);
                  const indications = [...new Set(trials.map(t => t.indication))];
                  const statuses = [...new Set(trials.map(t => t.status))];

                  return (
                    <div key={stage.key} className="flex flex-col items-center relative z-10 group/stage" style={{ flex: 1 }}>
                      {/* Milestone marker */}
                      <div className="relative">
                        <div style={{
                          width: isCurrent ? 22 : 16,
                          height: isCurrent ? 22 : 16,
                          borderRadius: "50%",
                          background: isCompleted
                            ? "#546e7a"
                            : isCurrent
                            ? "#4fc3f7"
                            : "var(--color-b1)",
                          border: isFuture
                            ? "2px dashed var(--color-bd)"
                            : isCurrent
                            ? "3px solid #4fc3f7"
                            : "2px solid #546e7a",
                          boxShadow: isCurrent
                            ? "0 0 12px #4fc3f755, 0 0 24px #4fc3f722"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                        }}>
                          {/* Inner icon */}
                          {isCompleted && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 4" stroke="#b0bec5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {isCurrent && (
                            <div style={{
                              width: 8, height: 8, borderRadius: "50%",
                              background: "#fff",
                              boxShadow: "0 0 6px #4fc3f766",
                            }} />
                          )}
                          {isFuture && (
                            <div style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: "var(--color-bd)",
                              opacity: 0.5,
                            }} />
                          )}
                        </div>

                        {/* Pulse ring for current */}
                        {isCurrent && (
                          <div style={{
                            position: "absolute", top: -4, left: -4, right: -4, bottom: -4,
                            borderRadius: "50%", border: "1px solid #4fc3f733",
                            animation: "pulse 2s ease-in-out infinite",
                          }} />
                        )}
                      </div>

                      {/* Stage label */}
                      <div className="mt-2 text-center">
                        <div className="text-[9px] font-semibold font-mono" style={{
                          color: isCompleted ? "#546e7a" : isCurrent ? "#4fc3f7" : "var(--color-t2)",
                          opacity: isFuture ? 0.45 : 1,
                        }}>
                          {stage.label}
                        </div>
                        {/* Year label */}
                        {year && (
                          <div className="text-[8px] font-mono mt-px" style={{
                            color: isCompleted ? "#546e7a" : isCurrent ? "#4fc3f7" : "var(--color-t2)",
                            opacity: isCompleted ? 0.7 : isCurrent ? 0.9 : 0.4,
                          }}>
                            {year}
                          </div>
                        )}
                      </div>

                      {/* Hover tooltip */}
                      {(trials.length > 0 || isCurrent) && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 rounded-lg px-3 py-2.5 pointer-events-none opacity-0 group-hover/stage:opacity-100 transition-opacity z-20"
                          style={{
                            background: "var(--color-b3)",
                            border: `1px solid ${isCurrent ? "#4fc3f744" : "var(--color-bd)"}`,
                            minWidth: 180,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                          }}>
                          <div className="text-[10px] font-bold mb-1.5" style={{ color: isCurrent ? "#4fc3f7" : isCompleted ? "#546e7a" : "var(--color-t2)" }}>
                            {stage.label}
                            {isCurrent && <span className="ml-1.5 text-[8px] font-normal px-1 py-px rounded" style={{ background: "#4fc3f720", color: "#4fc3f7" }}>Current</span>}
                            {isCompleted && <span className="ml-1.5 text-[8px] font-normal px-1 py-px rounded" style={{ background: "#546e7a20", color: "#90a4ae" }}>Completed</span>}
                          </div>
                          {trials.length > 0 ? (
                            <>
                              {trials.slice(0, 3).map((t, ti) => (
                                <div key={ti} className="py-1" style={{ borderTop: ti > 0 ? "1px solid var(--color-bd)" : "none" }}>
                                  <div className="text-[9px] font-mono font-semibold" style={{ color: "var(--color-a2)" }}>{t.nctId}</div>
                                  <div className="flex gap-1.5 text-[8px] mt-0.5" style={{ color: "var(--color-t2)" }}>
                                    <span>{t.enrollment.toLocaleString()} pts</span>
                                    <span>·</span>
                                    <span>{t.indication}</span>
                                  </div>
                                  <div className="flex gap-1.5 text-[8px] mt-0.5" style={{ color: "var(--color-t2)" }}>
                                    <span>{t.startDate}</span>
                                    <span>→</span>
                                    <span>{t.estCompletion}</span>
                                    <span>·</span>
                                    <span style={{ color: t.status === "Recruiting" || t.status === "Active" ? "#00e676" : t.status === "Completed" ? "#64b5f6" : t.status === "Terminated" ? "#ff6b6b" : "var(--color-t2)" }}>{t.status}</span>
                                  </div>
                                </div>
                              ))}
                              {trials.length > 3 && (
                                <div className="text-[8px] mt-1 font-mono" style={{ color: "var(--color-t2)" }}>+{trials.length - 3} more trial{trials.length - 3 > 1 ? "s" : ""}</div>
                              )}
                              <div className="mt-1 pt-1 flex gap-2 text-[8px]" style={{ borderTop: "1px solid var(--color-bd)" }}>
                                <span style={{ color: "var(--color-ac)" }}>{totalEnrollment.toLocaleString()} total pts</span>
                                <span style={{ color: "var(--color-t2)" }}>{indications.length} indication{indications.length !== 1 ? "s" : ""}</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-[9px]" style={{ color: "var(--color-t2)" }}>No trials in this phase yet</div>
                          )}
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                            style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${isCurrent ? "#4fc3f744" : "var(--color-bd)"}` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary line */}
              <div className="flex justify-center gap-3 mt-1 text-[8px]" style={{ color: "var(--color-t2)" }}>
                <span className="flex items-center gap-1">
                  <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: "#546e7a", border: "1.5px solid #546e7a" }} />
                  Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-[8px] h-[8px] rounded-full inline-block" style={{ background: "#4fc3f7", border: "2px solid #4fc3f7", boxShadow: "0 0 4px #4fc3f755" }} />
                  <span style={{ color: "#4fc3f7" }}>Current</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: "transparent", border: "1.5px dashed var(--color-bd)" }} />
                  Upcoming
                </span>
              </div>
            </BioCard>
          </>
        );
      })()}

      {/* Catalysts */}
      {cat.length > 0 && <>
        <SectionHeader>Catalysts ({cat.length})</SectionHeader>
        <BioCard className="mb-2.5">
          {cat.map((c, i) => {
            const mc = milestoneColor(c.type);
            const days = daysUntil(c.date);
            return (
              <div key={i} className="flex gap-[7px] py-1.5 items-center text-[10px]" style={{ borderBottom: i < cat.length - 1 ? "1px solid var(--color-bd)" : "none" }}>
                <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: mc, boxShadow: `0 0 5px ${mc}66` }} />
                <span className="font-mono min-w-[64px] text-[9px]" style={{ color: "var(--color-ac)" }}>{c.date}</span>
                <span className="font-mono text-[9px] min-w-[52px]" style={{ color: mc }}>{relativeTime(c.date)}</span>
                <span className="font-semibold">{c.type}</span>
                <span style={{ color: "var(--color-t2)" }}>· {c.indication}</span>
              </div>
            );
          })}
        </BioCard>
      </>}

      {/* Timeline */}
      {tr.length > 0 && (() => {
        const sorted = [...tr].sort((a, b) => a.startDate.localeCompare(b.startDate));
        const dates = sorted.flatMap((t) => [t.startDate, t.estCompletion]).filter(Boolean);
        // Include catalyst dates in range
        const catDates = cat.map(c => c.date);
        const allDates = [...dates, ...catDates];
        const minD = allDates.reduce((a, b) => a < b ? a : b);
        const maxD = allDates.reduce((a, b) => a > b ? a : b);
        const minT = new Date(minD).getTime();
        const range = Math.max(1, new Date(maxD).getTime() - minT);
        const pct = (d: string) => ((new Date(d).getTime() - minT) / range) * 100;
        const statusColor: Record<string, string> = {
          Recruiting: "#00e676", Active: "#00f5b0", Completed: "#64b5f6",
          Terminated: "#ff6b6b", Withdrawn: "#ff6b6b", Suspended: "#ffb74d",
          "Not yet recruiting": "#b0bec5", "Enrolling by invitation": "#ce93d8",
        };
        const phaseOrder: Record<string, number> = { "Phase 1": 1, "Phase 1/2": 2, "Phase 2": 3, "Phase 2/3": 4, "Phase 3": 5, "NDA/BLA": 6, Approved: 7, Preclinical: 0 };
        const bySorted = [...sorted].sort((a, b) => (phaseOrder[a.phase] ?? 0) - (phaseOrder[b.phase] ?? 0));

        // Build year + quarter markers
        const startYear = new Date(minD).getFullYear();
        const endYear = new Date(maxD).getFullYear();
        const markers: { label: string; pos: number; major: boolean }[] = [];
        for (let y = startYear; y <= endYear; y++) {
          for (let q = 0; q < 4; q++) {
            const m = q * 3 + 1;
            const dateStr = `${y}-${String(m).padStart(2, "0")}-01`;
            const pos = pct(dateStr);
            if (pos >= -2 && pos <= 102) {
              markers.push({ label: q === 0 ? String(y) : `Q${q + 1}`, pos: Math.max(0, Math.min(100, pos)), major: q === 0 });
            }
          }
        }

        // Dynamic today
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const todayPct = pct(todayStr);

        return <>
          <SectionHeader>Trial Timeline</SectionHeader>
          <BioCard className="mb-3">
            {/* Axis markers */}
            <div className="relative h-5 mb-1" style={{ marginLeft: 90 }}>
              {markers.map((m, i) => (
                <span key={i} className="absolute text-[7px] font-mono" style={{
                  left: `${m.pos}%`, color: m.major ? "var(--color-t1)" : "var(--color-t2)",
                  transform: "translateX(-50%)", fontWeight: m.major ? 700 : 400, fontSize: m.major ? 8 : 7,
                  opacity: m.major ? 1 : 0.6,
                }}>
                  {m.label}
                </span>
              ))}
            </div>
            {/* Axis line with ticks */}
            <div className="relative h-[6px] mb-2" style={{ marginLeft: 90 }}>
              <div className="absolute inset-x-0 top-[2px] h-px" style={{ background: "var(--color-bd)" }} />
              {markers.map((m, i) => (
                <div key={i} className="absolute" style={{
                  left: `${m.pos}%`, top: 0, width: 1, height: m.major ? 6 : 4,
                  background: m.major ? "var(--color-t2)" : "var(--color-bd)",
                }} />
              ))}
              {/* Today marker on axis */}
              {todayPct >= 0 && todayPct <= 100 && (
                <div className="absolute" style={{ left: `${todayPct}%`, top: -2, width: 2, height: 10, background: "var(--color-ac)", borderRadius: 1, opacity: 0.7 }} />
              )}
            </div>

            {/* Trial rows with milestone markers */}
            {bySorted.map((t, i) => {
              const startPct = Math.max(0, Math.min(100, pct(t.startDate)));
              const endPct = Math.max(0, Math.min(100, pct(t.estCompletion)));
              const clr = statusColor[t.status] || "var(--color-t2)";
              const isTerminated = t.status === "Terminated" || t.status === "Withdrawn";
              return (
                <div key={t.id} className="flex items-center gap-1.5 py-[3px] cursor-pointer group"
                  style={{ borderBottom: i < bySorted.length - 1 ? "1px solid var(--color-bd)" : "none" }}
                  onClick={() => window.location.href = `/trials/${t.id}`}>
                  <div className="shrink-0 w-[82px] text-right">
                    <span className="text-[7px] font-mono font-semibold" style={{ color: clr }}>{t.phase.replace("Phase ", "P")}</span>
                  </div>
                  <div className="flex-1 relative h-[16px]" style={{ background: "var(--color-b2)", borderRadius: 3 }}>
                    {/* Connecting line between start and end */}
                    <div style={{
                      position: "absolute", left: `${startPct}%`, width: `${Math.max(0.5, endPct - startPct)}%`, top: 7, height: 2,
                      borderRadius: 1, opacity: isTerminated ? 0.3 : 0.6,
                      background: isTerminated
                        ? `repeating-linear-gradient(90deg,${clr}66 0,${clr}66 3px,transparent 3px,transparent 6px)`
                        : `linear-gradient(90deg,${clr}44,${clr}88)`,
                    }} />
                    {/* Start marker (circle) */}
                    <div style={{
                      position: "absolute", left: `${startPct}%`, top: 4, width: 8, height: 8,
                      borderRadius: "50%", background: clr, opacity: isTerminated ? 0.4 : 0.85,
                      transform: "translateX(-4px)", border: `1.5px solid ${clr}`,
                      boxShadow: isTerminated ? "none" : `0 0 4px ${clr}44`,
                    }} />
                    {/* End marker (diamond) */}
                    <div style={{
                      position: "absolute", left: `${endPct}%`, top: 4, width: 8, height: 8,
                      transform: "translateX(-4px) rotate(45deg)", background: clr,
                      opacity: isTerminated ? 0.4 : 0.85, borderRadius: 1,
                      boxShadow: isTerminated ? "none" : `0 0 4px ${clr}44`,
                    }} />
                    {/* Today marker */}
                    {todayPct >= 0 && todayPct <= 100 && (
                      <div style={{ position: "absolute", left: `${todayPct}%`, top: 0, bottom: 0, width: 1, background: "var(--color-ac)", opacity: 0.25 }} />
                    )}
                  </div>
                  <div className="shrink-0 w-[55px]">
                    <span className="text-[7px] font-mono group-hover:underline" style={{ color: clr }}>{t.status.length > 8 ? t.status.slice(0, 7) + "…" : t.status}</span>
                  </div>
                </div>
              );
            })}

            {/* Catalyst milestone row */}
            {cat.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1.5 mt-1" style={{ borderTop: "1px solid var(--color-bd)" }}>
                <div className="shrink-0 w-[82px] text-right">
                  <span className="text-[7px] font-mono font-semibold" style={{ color: "var(--color-t2)" }}>Catalysts</span>
                </div>
                <div className="flex-1 relative h-[18px]" style={{ background: "var(--color-b2)", borderRadius: 3 }}>
                  {cat.map((c, i) => {
                    const pos = pct(c.date);
                    if (pos < 0 || pos > 100) return null;
                    const mc = milestoneColor(c.type);
                    return (
                      <div key={i} className="absolute group/cat" style={{ left: `${pos}%`, top: 3 }}>
                        <div style={{
                          width: 10, height: 10, transform: "translateX(-5px) rotate(45deg)",
                          background: mc, borderRadius: 1.5, opacity: 0.9,
                          boxShadow: `0 0 6px ${mc}55`,
                        }} />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[8px] whitespace-nowrap pointer-events-none opacity-0 group-hover/cat:opacity-100 transition-opacity z-10"
                          style={{ background: "var(--color-b3)", border: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>
                          <div className="font-semibold" style={{ color: mc }}>{c.type}</div>
                          <div>{c.date} · {relativeTime(c.date)}</div>
                          <div style={{ color: "var(--color-t2)" }}>{c.indication}</div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Today marker */}
                  {todayPct >= 0 && todayPct <= 100 && (
                    <div style={{ position: "absolute", left: `${todayPct}%`, top: 0, bottom: 0, width: 1, background: "var(--color-ac)", opacity: 0.25 }} />
                  )}
                </div>
                <div className="shrink-0 w-[55px]" />
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-2 mt-2.5 flex-wrap items-center">
              {Object.entries(statusColor).filter(([s]) => tr.some((t) => t.status === s)).map(([s, c]) => (
                <span key={s} className="flex items-center gap-0.5 text-[7px]" style={{ color: c }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c }} />{s}
                </span>
              ))}
              <span className="text-[7px] mx-1" style={{ color: "var(--color-t2)", opacity: 0.4 }}>|</span>
              <span className="flex items-center gap-0.5 text-[7px]" style={{ color: "var(--color-t1)" }}>
                <span className="inline-block w-[6px] h-[6px] rounded-full" style={{ background: "var(--color-t2)" }} />Start
              </span>
              <span className="flex items-center gap-0.5 text-[7px]" style={{ color: "var(--color-t1)" }}>
                <span className="inline-block w-[5px] h-[5px] rotate-45" style={{ background: "var(--color-t2)", borderRadius: 1 }} />Completion
              </span>
              <span className="flex items-center gap-0.5 text-[7px]" style={{ color: "var(--color-ac)", opacity: 0.5 }}>
                <span className="inline-block w-[6px] h-[1px]" style={{ background: "var(--color-ac)" }} />Today
              </span>
            </div>
          </BioCard>
        </>;
      })()}

      {/* Trials */}
      <SectionHeader>Trials ({tr.length})</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-3" style={{ border: "1px solid var(--color-bd)" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)" }}>
              {["NCT", "Phase", "Indication", "Status", "N", "EP"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tr.map((t) => (
              <tr key={t.id} onClick={() => window.location.href = `/trials/${t.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{t.nctId}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={t.phase} small /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <Link href={`/diseases/${encodeURIComponent(t.indication)}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: "var(--color-a2)" }}>{t.indication}</Link>
                </td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><StatusDot status={t.status} /></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{t.enrollment}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{t.endpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitors */}
      {comp.length > 0 && <>
        <SectionHeader>Competitors ({comp.length})</SectionHeader>
        <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)" }}>
          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr style={{ background: "var(--color-b2)" }}>
                {["Drug", "Company", "Phase", "Target", "MOA"].map((h) => (
                  <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                    style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comp.map((r) => (
                <tr key={r.id} onClick={() => window.location.href = `/drugs/${r.id}`} className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{r.name || r.code}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", whiteSpace: "nowrap" }}>
                    <Link href={`/companies/${r.companyId}`} onClick={(e) => e.stopPropagation()} className="hover:underline" style={{ color: mcTierColor(mcTier(coMap.get(r.companyId)?.marketCap ?? null)) }}>{r.companyName}</Link>
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.highestPhase || r.phase} small /></td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.target}</td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{r.moa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  );
}
