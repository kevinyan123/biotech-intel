"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DB, PH, mcTier, mcTierColor, pC } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import SectionHeader from "@/components/ui/SectionHeader";

const catTypeColor = (t: string) => {
  if (t.includes("PDUFA") || t.includes("NDA") || t.includes("EMA")) return "#f48fb1";
  if (t.includes("Ph3") || t.includes("Phase 3")) return "#ffb74d";
  if (t.includes("Ph2") || t.includes("Phase 2")) return "#81c784";
  if (t.includes("BTD") || t.includes("Fast") || t.includes("Orphan")) return "#ce93d8";
  if (t.includes("Conference")) return "#4fc3f7";
  return "var(--color-a3)";
};

export default function CatalystsPage() {
  const [month, setMonth] = useState(3);
  const [mcF, setMcF] = useState<string | null>(null);
  const [phF, setPhF] = useState<string | null>(null);
  const [typeF, setTypeF] = useState<string | null>(null);
  const [selDay, setSelDay] = useState<number | null>(null);

  const types = useMemo(() => [...new Set(DB.catalysts.map((c) => c.type))], []);

  const enriched = useMemo(() => DB.catalysts.map((c) => {
    const co = DB.companies.find((x) => x.id === c.companyId);
    const drug = DB.drugs.find((x) => x.id === c.drugId);
    return { ...c, tier: co ? mcTier(co.marketCap) : "Private", drugPhase: drug ? (drug.highestPhase || drug.phase) : "Unknown", mc: co?.marketCap ?? null };
  }), []);

  const filtered = useMemo(() => {
    let d = enriched;
    if (mcF) d = d.filter((c) => c.tier === mcF);
    if (phF) d = d.filter((c) => c.drugPhase === phF);
    if (typeF) d = d.filter((c) => c.type === typeF);
    return d;
  }, [enriched, mcF, phF, typeF]);

  const yr = 2026;
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysInMonth = new Date(yr, month, 0).getDate();
  const firstDow = new Date(yr, month - 1, 1).getDay();
  const weeks = Math.ceil((daysInMonth + firstDow) / 7);

  const monthStr = `${yr}-${String(month).padStart(2, "0")}`;
  const monthEvents = filtered.filter((c) => c.date.startsWith(monthStr));
  const eventsByDay: Record<number, typeof filtered> = {};
  monthEvents.forEach((c) => { const d = parseInt(c.date.split("-")[2]); if (!eventsByDay[d]) eventsByDay[d] = []; eventsByDay[d].push(c); });
  const selEvents = selDay ? eventsByDay[selDay] || [] : [];
  const today = 6;

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-lg font-bold mb-1">Catalyst Calendar</h2>
      <p className="text-[11px] mb-1.5" style={{ color: "var(--color-t2)" }}>
        {filtered.length} events across {new Set(filtered.map((c) => c.companyId)).size} companies
      </p>

      {/* Legend */}
      <div className="flex gap-2.5 mb-3.5 text-[9px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
        <span className="font-semibold">Legend:</span>
        {[["PDUFA / NDA / EMA", "#f48fb1"], ["Phase 3 Readout", "#ffb74d"], ["Phase 2 Data", "#81c784"], ["Regulatory", "#ce93d8"], ["Conference", "#4fc3f7"], ["Other", "var(--color-a3)"]].map(([label, color], i) => (
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
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>Drug Phase</div>
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
          <div className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>Event Type</div>
          <div className="flex gap-[3px] flex-wrap">
            {types.slice(0, 8).map((t) => (
              <button key={t} onClick={() => setTypeF(typeF === t ? null : t)}
                className="rounded-[5px] px-[9px] py-[3px] text-[9px] cursor-pointer transition-all"
                style={{ background: typeF === t ? `${catTypeColor(t)}15` : "transparent", border: `1px solid ${typeF === t ? catTypeColor(t) + "44" : "var(--color-bd)"}`, color: typeF === t ? catTypeColor(t) : "var(--color-t2)", fontWeight: typeF === t ? 600 : 400 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month Nav */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => { setMonth((m) => Math.max(1, m - 1)); setSelDay(null); }}
          className="rounded-md px-2.5 py-1 text-sm cursor-pointer" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>←</button>
        <div className="text-base font-bold font-serif min-w-[120px] text-center">{monthNames[month]} {yr}</div>
        <button onClick={() => { setMonth((m) => Math.min(12, m + 1)); setSelDay(null); }}
          className="rounded-md px-2.5 py-1 text-sm cursor-pointer" style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>→</button>
        <span className="text-[11px] ml-2" style={{ color: "var(--color-t2)" }}>{monthEvents.length} events this month</span>
        {(mcF || phF || typeF) && <button onClick={() => { setMcF(null); setPhF(null); setTypeF(null); }}
          className="ml-auto rounded-[5px] px-2 py-[3px] text-[9px] cursor-pointer"
          style={{ background: "var(--color-rd)15", color: "var(--color-rd)", border: "1px solid var(--color-rd)30" }}>Clear Filters</button>}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: selDay ? "1fr 340px" : "1fr" }}>
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
                const isToday = month === 3 && dayNum === today;
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
                          <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: catTypeColor(ev.type), boxShadow: `0 0 4px ${catTypeColor(ev.type)}66` }} />
                        ))}
                        {events.length > 5 && <span className="text-[7px]" style={{ color: "var(--color-t2)" }}>+{events.length - 5}</span>}
                      </div>
                      {events.length > 0 && (
                        <div className="text-[8px] leading-tight">
                          <div className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{events[0].drugName}</div>
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
                <div className="text-base font-bold font-serif">{monthNames[month]} {selDay}, {yr}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--color-t2)" }}>{selEvents.length} catalyst{selEvents.length !== 1 ? "s" : ""} scheduled</div>
              </div>
              <button onClick={() => setSelDay(null)} className="rounded-md w-7 h-7 flex items-center justify-center text-sm cursor-pointer"
                style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>×</button>
            </div>

            {selEvents.length === 0 && <div className="p-[30px] text-center text-[11px]" style={{ color: "var(--color-t2)" }}>No catalysts on this day.</div>}

            {selEvents.map((ev, i) => (
              <Link key={i} href={`/drugs/${ev.drugId}`}
                className="block p-2.5 mb-2 rounded-lg transition-colors cursor-pointer"
                style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)" }}>
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[9px] font-bold rounded px-1.5 py-0.5" style={{ color: catTypeColor(ev.type), background: `${catTypeColor(ev.type)}15`, border: `1px solid ${catTypeColor(ev.type)}30` }}>{ev.type}</span>
                  <span className="text-[8px] font-semibold" style={{ color: mcTierColor(ev.tier) }}>{ev.tier} Cap</span>
                </div>
                <div className="text-[13px] font-bold mb-[3px]">{ev.drugName}</div>
                <div className="flex gap-1.5 text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>
                  <span>{ev.companyName}</span>
                  <span>·</span>
                  <span>{ev.indication}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <PhaseBadge phase={ev.drugPhase} small />
                  {ev.mc && <span className="text-[9px] font-mono" style={{ color: "var(--color-t2)" }}>${ev.mc}B</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Full List */}
      <SectionHeader>All Events ({filtered.length})</SectionHeader>
      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Date", "Type", "Drug", "Company", "Phase", "Tier", "Indication"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} onClick={() => window.location.href = `/drugs/${r.drugId}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-mono font-semibold text-[9px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{r.date}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                  <span className="text-[8px] font-semibold rounded px-[5px] py-px" style={{ color: catTypeColor(r.type), background: `${catTypeColor(r.type)}12` }}>{r.type}</span>
                </td>
                <td className="whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>{r.drugName}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-t1)" }}>{r.companyName}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={r.drugPhase} small /></td>
                <td className="text-[8px] font-semibold" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: mcTierColor(r.tier) }}>{r.tier}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>{r.indication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
