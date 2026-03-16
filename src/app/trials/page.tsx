"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { readoutConfidenceColor } from "@/lib/catalyst-utils";
import PhaseBadge from "@/components/ui/PhaseBadge";
import StatusDot from "@/components/ui/StatusDot";

// Filter options (matches CT.gov normalised values)
const PH = ["Phase 1", "Phase 1/2", "Phase 2", "Phase 2/3", "Phase 3", "Approved", "N/A"];
const STS = ["Recruiting", "Active", "Completed", "Terminated", "Not yet recruiting"];

interface TrialRow {
  nctId: string;
  title: string;
  phase: string;
  status: string;
  indication: string | null;
  drugName: string | null;
  companyId: number | null;
  companyName: string | null;
  enrollment: number | null;
  readoutDate: string | null;
  readoutConfidence: string;
  resultsAvailable: boolean;
}

const PP = 50;

export default function TrialsPage() {
  const router = useRouter();
  const [phaseF, setPhaseF] = useState<string | null>(null);
  const [statusF, setStatusF] = useState<string | null>(null);
  const [pg, setPg] = useState(1);
  const [trials, setTrials] = useState<TrialRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrials = useCallback(async (page: number, phase: string | null, status: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PP) });
      if (phase) params.set("phase", phase);
      if (status) params.set("status", status);
      const res = await fetch(`/api/trials?${params}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to load trials");
        setTrials([]);
        setTotal(0);
        setTotalPages(0);
      } else {
        setTrials(json.data ?? []);
        setTotal(json.total ?? 0);
        setTotalPages(json.totalPages ?? 0);
      }
    } catch {
      setError("Network error — could not load trials");
      setTrials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrials(pg, phaseF, statusF);
  }, [pg, phaseF, statusF, fetchTrials]);

  const handlePhase = (v: string | null) => { setPhaseF(v); setPg(1); };
  const handleStatus = (s: string) => { setStatusF(statusF === s ? null : s); setPg(1); };

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <h2 className="text-base font-bold mb-2.5">
        Trials{" "}
        {!loading && (
          <span className="font-normal text-[11px]" style={{ color: "var(--color-t2)" }}>
            ({total.toLocaleString()})
          </span>
        )}
      </h2>

      <div className="flex gap-[3px] mb-2 flex-wrap">
        <select
          value={phaseF || ""}
          onChange={(e) => handlePhase(e.target.value || null)}
          className="rounded px-[6px] py-[3px] text-[9px] outline-none cursor-pointer"
          style={{
            background: "var(--color-b2)",
            color: phaseF ? "var(--color-ac)" : "var(--color-t2)",
            border: `1px solid ${phaseF ? "var(--color-ac)33" : "var(--color-bd)"}`,
          }}
        >
          <option value="">Phase</option>
          {PH.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {STS.map((s) => (
          <button
            key={s}
            onClick={() => handleStatus(s)}
            className="rounded px-[5px] py-[2px] text-[8px] cursor-pointer"
            style={{
              background: statusF === s ? "var(--color-b3)" : "transparent",
              border: `1px solid ${statusF === s ? "var(--color-bd2)" : "var(--color-bd)"}`,
              color: statusF === s ? "var(--color-t0)" : "var(--color-t2)",
            }}
          >
            {s.length > 12 ? s.slice(0, 10) + "…" : s}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-md px-3 py-2 mb-2 text-[10px]"
          style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b" }}>
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-md" style={{ border: "1px solid var(--color-bd)", maxHeight: 460, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["NCT", "Drug", "Sponsor", "Phase", "Indication", "Status", "Readout", "N", "✓"].map((h) => (
                <th
                  key={h}
                  className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[10px]" style={{ color: "var(--color-t2)" }}>
                  Loading trials…
                </td>
              </tr>
            ) : trials.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[10px]" style={{ color: "var(--color-t2)" }}>
                  No trials found.{" "}
                  {!phaseF && !statusF && (
                    <span style={{ color: "var(--color-t2)" }}>
                      Run <code className="font-mono">npx tsx scripts/import-clinical-trials.ts</code> to populate.
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              trials.map((r) => (
                <tr
                  key={r.nctId}
                  onClick={() => router.push(`/trials/${r.nctId}`)}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-a2)" }}>
                    {r.nctId}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", whiteSpace: "nowrap" }}>
                    <span style={{ color: "var(--color-a2)" }}>{r.drugName ?? "—"}</span>
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: "var(--color-t1)" }}>{r.companyName ?? "—"}</span>
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    <PhaseBadge phase={r.phase} small />
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", maxWidth: 100 }}>
                    {r.indication ? (
                      <Link
                        href={`/diseases/${encodeURIComponent(r.indication)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                        style={{ color: "var(--color-a2)" }}
                      >
                        {r.indication}
                      </Link>
                    ) : (
                      <span style={{ color: "var(--color-t2)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    <StatusDot status={r.status} />
                  </td>
                  <td className="font-mono text-[8px] whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: readoutConfidenceColor(r.readoutConfidence) }}>
                    {r.readoutDate ?? "Unknown"}
                    {r.readoutConfidence === "estimated" ? " ᴱ" : ""}
                    {r.readoutConfidence === "unknown" ? " ?" : ""}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)" }}>
                    {r.enrollment?.toLocaleString() ?? "—"}
                  </td>
                  <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>
                    {r.resultsAvailable ? (
                      <span className="text-[9px]" style={{ color: "#00e676" }}>✓</span>
                    ) : (
                      <span className="text-[9px]" style={{ color: "var(--color-t2)" }}>–</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-0.5 mt-2">
          {pg > 1 && (
            <button
              onClick={() => setPg(pg - 1)}
              className="font-mono text-[9px] rounded px-1.5 py-0.5"
              style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}
            >
              ←
            </button>
          )}
          {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
            const pn = totalPages <= 8 ? i + 1 : pg < 5 ? i + 1 : pg > totalPages - 4 ? totalPages - 7 + i : pg - 3 + i;
            return (
              <button
                key={pn}
                onClick={() => setPg(pn)}
                className="font-mono text-[9px] rounded px-1.5 py-0.5 font-semibold min-w-[24px]"
                style={{
                  background: pg === pn ? "var(--color-ac)" : "var(--color-b2)",
                  color: pg === pn ? "var(--color-b0)" : "var(--color-t2)",
                  border: "1px solid var(--color-bd)",
                }}
              >
                {pn}
              </button>
            );
          })}
          {pg < totalPages && (
            <button
              onClick={() => setPg(pg + 1)}
              className="font-mono text-[9px] rounded px-1.5 py-0.5"
              style={{ background: "var(--color-b2)", border: "1px solid var(--color-bd)", color: "var(--color-t2)" }}
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
