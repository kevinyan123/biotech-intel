"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor, pC } from "@/lib/biovault-data";
import PhaseBadge from "@/components/ui/PhaseBadge";
import SectionHeader from "@/components/ui/SectionHeader";

const statusColor = (s: string) => {
  if (s === "Recruiting") return "#00e676";
  if (s === "Active") return "#00f5b0";
  if (s === "Completed") return "#64b5f6";
  if (s === "Terminated") return "#ff6b6b";
  if (s === "Not yet recruiting") return "#b0bec5";
  return "var(--color-a3)";
};

export default function CalendarPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [mcF, setMcF] = useState<string | null>(null);
  const [phF, setPhF] = useState<string | null>(null);
  const [stF, setStF] = useState<string | null>(null);
  const [selDay, setSelDay] = useState<number | null>(null);

  const coMap = useMemo(() => new Map(DB.companies.map((c) => [c.id, c])), []);

  const enriched = useMemo(() => DB.trials.map((t) => {
    const co = coMap.get(t.companyId);
    return { ...t, tier: co ? mcTier(co.marketCap) : "Private", mc: co?.marketCap ?? null };
  }), [coMap]);

  const filtered = useMemo(() => {
    let d = enriched;
    if (mcF) d = d.filter((t) => t.tier === mcF);
    if (phF) d = d.filter((t) => t.phase === phF);
    if (stF) d = d.filter((t) => t.status === stF);
    return d;
  }, [enriched, mcF, phF, stF]);

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();
  const weeks = Math.ceil((daysInMonth + firstDow) / 7);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const monthEvents = filtered.filter((t) => t.estCompletion.startsWith(monthStr));
  const eventsByDay: Record<number, typeof filtered> = {};
  monthEvents.forEach((t) => {
    const parts = t.estCompletion.split("-");
    const d = parts.length >= 3 ? parseInt(parts[2]) : 1;
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(t);
  });
  const selEvents = selDay ? eventsByDay[selDay] || [] : [];
  const isCurrentMonth = year === 2026 && month === 3;
  const today = 6;

  const prevMonth = () => {
    setSelDay(null);
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    setSelDay(null);
    if (month === 12) { setYear(year + 1); setMonth(1); }
    else setMonth(month + 1);
  };

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-lg font-bold mb-1">Trial Completion Calendar</h2>
      <p className="text-[11px] mb-1.5" style={{ color: "var(--color-t2)" }}>
        {filtered.length} trials across {new Set(filtered.map((t) => t.companyId)).size} companies
      </p>

      {/* Legend */}
      <div className="flex gap-2.5 mb-3.5 text-[9px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
        <span className="font-semibold">Status:</span>
        {[["Recruiting", "#00e676"], ["Active", "#00f5b0"], ["Completed", "#64b5f6"], ["Terminated", "#ff6b6b"], ["Not yet recruiting", "#b0bec5"]].map(([label, color], i) => (
          <span key={i} className="inline-flex items-center gap-[3px]">
            <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: color, boxShadow: `0 0 4px ${color}55` }} />
            {label}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>Market Cap</div>
          <div className="flex gap-[3px]">
            {["Micro", "Small", "Mid", "Large"].map((t) => (
              <button key={t} onClick={() => setMcF(mcF === t ? null : t)}
                className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all"
                style={{ background: mcF === t ? `${mcTierColor(t)}15` : "transparent", border: `1px solid ${mcF === t ? mcTierColor(t) + "44" : "var(--color-bd)"}`, color: mcF === t ? mcTierColor(t) : "var(--color-t2)", fontWeight: mcF === t ? 600 : 400 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>Phase</div>
          <div className="flex gap-[3px]">
            {["Phase 1", "Phase 2", "Phase 3", "NDA/BLA", "Approved"].map((p) => {
              const c = pC(p);
              return (
                <button key={p} onClick={() => setPhF(phF === p ? null : p)}
                  className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all"
                  style={{ background: phF === p ? `${c.f}15` : "transparent", border: `1px solid ${phF === p ? c.f + "44" : "var(--color-bd)"}`, color: phF === p ? c.f : "var(--color-t2)", fontWeight: phF === p ? 600 : 400 }}>
                  {p.replace("Phase ", "P")}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>Status</div>
          <div className="flex gap-[3px]">
            {["Recruiting", "Active", "Completed", "Terminated", "Not yet recruiting"].map((s) => (
              <button key={s} onClick={() => setStF(stF === s ? null : s)}
                className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all"
                style={{ background: stF === s ? `${statusColor(s)}15` : "transparent", border: `1px solid ${stF === s ? statusColor(s) + "44" : "var(--color-bd)"}`, color: stF === s ? statusColor(s) : "var(--color-t2)", fontWeight: stF === s ? 600 : 400 }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Nav */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={prevMonth}
          className="rounded-md px-2.5 py-1 text-sm cursor-pointer" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>←</button>
        <div className="text-base font-bold font-serif min-w-[120px] text-center">{monthNames[month]} {year}</div>
        <button onClick={nextMonth}
          className="rounded-md px-2.5 py-1 text-sm cursor-pointer" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>→</button>
        <span className="text-[11px] ml-2" style={{ color: "var(--color-t2)" }}>{monthEvents.length} completions this month</span>
        {(mcF || phF || stF) && <button onClick={() => { setMcF(null); setPhF(null); setStF(null); }}
          className="ml-auto rounded-[5px] px-2 py-[3px] text-[9px] cursor-pointer"
          style={{ background: "var(--color-rd)15", color: "var(--color-rd)", border: "1px solid var(--color-rd)30" }}>Clear Filters</button>}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: selDay ? "1fr 360px" : "1fr" }}>
        {/* Calendar Grid */}
        <div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[9px] font-semibold font-mono py-1" style={{ color: "var(--color-t2)" }}>{d}</div>
            ))}
          </div>
          {Array.from({ length: weeks }, (_, w) => (
            <div key={w} className="grid grid-cols-7 gap-0.5 mb-0.5">
              {Array.from({ length: 7 }, (_, d) => {
                const dayNum = w * 7 + d - firstDow + 1;
                const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                const events = isValid ? eventsByDay[dayNum] || [] : [];
                const isToday = isCurrentMonth && dayNum === today;
                const isSel = dayNum === selDay;

                return (
                  <div key={d} onClick={() => { if (isValid) setSelDay(isSel ? null : dayNum); }}
                    className="rounded-md transition-all"
                    style={{
                      minHeight: 76, padding: 5, cursor: isValid ? "pointer" : "default",
                      background: isSel ? "rgba(0,223,162,0.08)" : isToday ? "rgba(77,166,232,0.06)" : "var(--color-b1)",
                      border: `1px solid ${isSel ? "rgba(0,223,162,0.25)" : isToday ? "rgba(77,166,232,0.2)" : "var(--color-bd)"}`,
                      opacity: isValid ? 1 : 0.1,
                    }}>
                    {isValid && <>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono" style={{ fontWeight: isToday || isSel ? 700 : 400, color: isToday ? "var(--color-a2)" : isSel ? "var(--color-ac)" : "var(--color-t1)" }}>{dayNum}</span>
                        {events.length > 0 && <span className="text-[9px] font-mono font-bold rounded px-1" style={{ color: "var(--color-ac)", background: "rgba(0,223,162,0.12)" }}>{events.length}</span>}
                      </div>
                      <div className="flex flex-wrap gap-0.5 mb-[3px]">
                        {events.slice(0, 5).map((ev, i) => (
                          <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: statusColor(ev.status), boxShadow: `0 0 4px ${statusColor(ev.status)}66` }} />
                        ))}
                        {events.length > 5 && <span className="text-[7px]" style={{ color: "var(--color-t2)" }}>+{events.length - 5}</span>}
                      </div>
                      {events.length > 0 && (
                        <div className="text-[8px] leading-tight">
                          <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{events[0].drugName || events[0].drugCode}</div>
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: "var(--color-t2)" }}>{events[0].companyName}</div>
                        </div>
                      )}
                    </>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selDay && (
          <div className="rounded-[10px] p-4 max-h-[520px] overflow-y-auto" style={{ background: "var(--color-b1)", border: "1px solid var(--color-bd)" }}>
            <div className="flex justify-between items-center mb-3.5">
              <div>
                <div className="text-base font-bold font-serif">{monthNames[month]} {selDay}, {year}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--color-t2)" }}>{selEvents.length} trial{selEvents.length !== 1 ? "s" : ""} completing</div>
              </div>
              <button onClick={() => setSelDay(null)} className="rounded-md w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
                style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>×</button>
            </div>

            {selEvents.length === 0 && <div className="p-[30px] text-center text-[11px]" style={{ color: "var(--color-t2)" }}>No trial completions on this day.</div>}

            {selEvents.map((ev, i) => (
              <Link key={i} href={`/trials/${ev.id}`}
                className="block p-2.5 mb-2 rounded-lg transition-colors cursor-pointer"
                style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)" }}>
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[9px] font-bold rounded px-1.5 py-0.5" style={{ color: statusColor(ev.status), background: `${statusColor(ev.status)}15`, border: `1px solid ${statusColor(ev.status)}30` }}>{ev.status}</span>
                  <span className="text-[8px] font-semibold" style={{ color: mcTierColor(ev.tier) }}>{ev.tier} Cap</span>
                </div>
                <div className="text-[13px] font-bold mb-[3px]">{ev.drugName || ev.drugCode}</div>
                <div className="text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>
                  <span style={{ color: mcTierColor(ev.tier) }}>{ev.companyName}</span>
                  <span className="mx-1">·</span>
                  <span>{ev.indication}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <PhaseBadge phase={ev.phase} small />
                  <span className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>{ev.nctId}</span>
                  <span className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>· {ev.enrollment} pts</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Full Table */}
      <SectionHeader>Completions This Month ({monthEvents.length})</SectionHeader>
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Est. Completion", "Status", "Drug", "Company", "Phase", "Tier", "Indication", "Pts"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthEvents.sort((a, b) => a.estCompletion.localeCompare(b.estCompletion)).map((r, i) => (
              <tr key={i} onClick={() => window.location.href = `/trials/${r.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono font-semibold text-[9px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{r.estCompletion}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <span className="text-[8px] font-semibold rounded px-[5px] py-px" style={{ color: statusColor(r.status), background: `${statusColor(r.status)}12` }}>{r.status}</span>
                </td>
                <td className="whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{r.drugName || r.drugCode}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: mcTierColor(r.tier) }}>{r.companyName}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.phase} small /></td>
                <td className="text-[8px] font-semibold" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mcTierColor(r.tier) }}>{r.tier}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.indication}</td>
                <td className="font-mono text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>{r.enrollment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
