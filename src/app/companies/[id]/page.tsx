"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { DB, mcTier, mcTierColor } from "@/lib/biovault-data";
import BioCard from "@/components/ui/BioCard";
import PhaseBadge from "@/components/ui/PhaseBadge";
import Tag from "@/components/ui/Tag";
import SectionHeader from "@/components/ui/SectionHeader";
import StockChart from "@/components/company/StockChart";
import InsiderTrading from "@/components/company/InsiderTrading";

const fColor = (t: string) => {
  if (t.startsWith("10-K")) return "#4fc3f7";
  if (t.startsWith("10-Q")) return "#81c784";
  if (t.startsWith("8-K")) return "#ffb74d";
  if (t.includes("DEF") || t.includes("14A")) return "#ce93d8";
  if (t.startsWith("S-1") || t.startsWith("S-3")) return "#f48fb1";
  if (t.startsWith("20-F") || t.startsWith("6-K")) return "#80deea";
  return "var(--color-t2)";
};

interface Filing {
  type: string;
  title: string;
  date: string;
  url: string;
  accession?: string;
}

interface IdentityResult {
  cik: number | null;
  secCompanyName: string | null;
  validated: boolean;
  validationMethod: string;
  confidence: number;
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const co = DB.companies.find((c) => c.id === id);
  if (!co) return <div className="p-10 text-center" style={{ color: "var(--color-t2)" }}>Company not found</div>;

  const dr = DB.drugs.filter((d) => d.companyId === id);
  const tr = DB.trials.filter((t) => t.companyId === id);
  const cat = DB.catalysts.filter((c) => c.companyId === id);
  const tier = mcTier(co.marketCap);
  const approved = dr.filter((d) => (d.highestPhase || d.phase) === "Approved").length;
  const failed = tr.filter((t) => t.status === "Terminated").length;

  // Identity resolution state
  const [identity, setIdentity] = useState<IdentityResult | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);

  // SEC filings state
  const [filings, setFilings] = useState<Filing[]>([]);
  const [filingsLoading, setFilingsLoading] = useState(false);
  const [secFound, setSecFound] = useState<boolean | null>(null);
  const [secCompany, setSecCompany] = useState<string | null>(null);

  // Two-step identity resolution → SEC data fetch
  useEffect(() => {
    if (!co.isPublic || !co.ticker) return;

    // International companies: skip SEC entirely
    if (!co.secEligible) {
      setIdentity({ cik: null, secCompanyName: null, validated: false, validationMethod: "not_applicable", confidence: 0 });
      return;
    }

    setIdentityLoading(true);

    // Step 1: Resolve and validate identity
    fetch(`/api/identity?ticker=${encodeURIComponent(co.ticker)}&company=${encodeURIComponent(co.name)}`)
      .then((r) => r.json())
      .then((idData: IdentityResult) => {
        setIdentity(idData);

        // Step 2: Only fetch SEC filings if identity is validated
        if (idData.validated && idData.cik) {
          setFilingsLoading(true);
          return fetch(`/api/sec?ticker=${encodeURIComponent(co.ticker!)}&cik=${idData.cik}`)
            .then((r) => r.json())
            .then((data) => {
              setFilings(data.filings || []);
              setSecFound(data.found ?? false);
              setSecCompany(data.company || null);
            })
            .finally(() => setFilingsLoading(false));
        } else {
          setSecFound(false);
        }
      })
      .catch(() => {
        setIdentity({ cik: null, secCompanyName: null, validated: false, validationMethod: "error", confidence: 0 });
        setSecFound(false);
      })
      .finally(() => setIdentityLoading(false));
  }, [co.isPublic, co.ticker, co.name, co.secEligible]);

  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-4 text-[9px]" style={{ color: "var(--color-t2)" }}>
        <Link href="/companies" className="hover:underline" style={{ color: "var(--color-ac)" }}>← Companies</Link>
        <span className="opacity-30">|</span>
        <span>{co.name}</span>
      </div>

      {/* Header */}
      <div className="flex gap-3.5 mb-5 items-start">
        <div className="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center text-lg font-bold font-mono shrink-0"
          style={{ background: "var(--color-b3)", color: "var(--color-ac)", border: "1px solid var(--color-bd2)" }}>
          {(co.ticker || co.name.slice(0, 2)).slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-0.5">{co.name}</h2>
          <div className="flex gap-2.5 text-[11px] flex-wrap items-center" style={{ color: "var(--color-t2)" }}>
            {co.ticker && (
              <span className="font-mono font-semibold text-xs flex items-center gap-1" style={{ color: "var(--color-a2)" }}>
                {co.ticker}
                {/* Validation indicator */}
                {identity?.validated && (
                  <span title={`SEC Verified: ${identity.secCompanyName} (CIK ${identity.cik})`}
                    className="text-[9px]" style={{ color: "#00e676" }}>✓</span>
                )}
                {identity && !identity.validated && identity.cik && identity.validationMethod === "unvalidated" && (
                  <span title={`SEC name mismatch: "${identity.secCompanyName}"`}
                    className="text-[9px]" style={{ color: "#ffb74d" }}>⚠</span>
                )}
              </span>
            )}
            {co.ticker && <span>·</span>}
            {co.exchange && co.exchange !== "Private" && co.exchange !== "Acq" && (
              <span>{co.exchange}{!co.secEligible && co.isPublic ? "" : ""}</span>
            )}
            <span>{co.hq}</span>
            {co.founded && <span>Founded {co.founded}</span>}
            {co.employees && <span>{co.employees.toLocaleString()} employees</span>}
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: mcTierColor(tier), background: `${mcTierColor(tier)}15`, border: `1px solid ${mcTierColor(tier)}30` }}>
              {tier} Cap
            </span>
            <Tag color="var(--color-t1)">{co.type}</Tag>
            <Tag color={co.fundingStatus === "Public" ? "var(--color-ac)" : co.fundingStatus === "Acquired" ? "var(--color-t2)" : "var(--color-a3)"}>{co.fundingStatus}</Tag>
            {co.therapeuticAreas.map((a, i) => <Tag key={i}>{a}</Tag>)}
          </div>
          {co.platform && <div className="text-[10px] mt-1.5" style={{ color: "var(--color-t2)" }}>Platform: <span style={{ color: "var(--color-t1)" }}>{co.platform}</span></div>}
          {co.website && (
            <div className="text-[10px] mt-0.5">
              <a href={co.website} target="_blank" rel="noopener noreferrer" className="hover:underline font-mono" style={{ color: "var(--color-a2)" }}>
                {co.website.replace("https://www.", "")} ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {[
          { l: "Market Cap", v: co.marketCap ? `$${co.marketCap}B` : "N/A", c: "var(--color-ac)" },
          { l: "All Drugs", v: dr.length, c: "var(--color-t0)" },
          { l: "Clinical Trials", v: tr.length, c: "var(--color-a2)" },
          { l: "Failed / Terminated", v: failed, c: failed > 0 ? "var(--color-rd)" : "var(--color-t2)" },
          { l: "FDA Approved", v: approved, c: approved > 0 ? "#00e676" : "var(--color-t2)" },
        ].map((m, i) => (
          <BioCard key={i} style={{ textAlign: "center", padding: 14 }}>
            <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-t2)" }}>{m.l}</div>
            <div className="text-[22px] font-bold font-mono" style={{ color: m.c }}>{m.v}</div>
          </BioCard>
        ))}
      </div>

      {/* Stock Price Chart — public companies only */}
      {co.isPublic && co.ticker && co.marketCap && (
        <>
          <SectionHeader>Stock Price & Catalysts ({co.ticker})</SectionHeader>
          <BioCard className="mb-4" style={{ padding: 16 }}>
            <StockChart
              companyId={co.id}
              ticker={co.ticker}
              marketCap={co.marketCap}
              catalysts={cat}
            />
          </BioCard>
        </>
      )}

      {/* Drug Pipeline Table */}
      <SectionHeader>Drug Pipeline ({dr.length} programs)</SectionHeader>
      <div className="overflow-x-auto rounded-md mb-4" style={{ border: "1px solid var(--color-bd)", maxHeight: 320, overflowY: "auto" }}>
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr style={{ background: "var(--color-b2)", position: "sticky", top: 0, zIndex: 2 }}>
              {["Drug Name", "Code", "Phase", "Trials", "Modality", "Target", "MOA", "Indications"].map((h) => (
                <th key={h} className="text-left font-semibold uppercase tracking-wider font-mono whitespace-nowrap"
                  style={{ padding: "6px 8px", color: "var(--color-t2)", fontSize: 8, borderBottom: "1px solid var(--color-bd)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dr.map((d) => (
              <tr key={d.id} onClick={() => window.location.href = `/drugs/${d.id}`} className="cursor-pointer transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td className="font-semibold whitespace-nowrap" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t0)" }}>{d.name || d.code}</td>
                <td className="font-mono text-[9px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t2)" }}>{d.code}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><PhaseBadge phase={d.highestPhase || d.phase} /></td>
                <td className="font-mono font-semibold text-[10px]" style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-ac)" }}>{d.trialCount || 0}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>{d.modality}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}><Link href={`/targets/${encodeURIComponent(d.target)}`} className="hover:underline" style={{ color: "var(--color-a2)" }}>{d.target}</Link></td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)", color: "var(--color-t1)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis" }}>{d.moa}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--color-bd)" }}>{(d.allIndications || d.indications).slice(0, 2).map((x, i) => <Tag key={i} color="var(--color-a2)">{x}</Tag>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SEC Filings & Financial Documents */}
      {co.isPublic && co.secEligible && <>
        <SectionHeader>SEC Filings & Financial Documents</SectionHeader>

        {/* Loading state */}
        {(identityLoading || filingsLoading) && (
          <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
            <div className="text-xs" style={{ color: "var(--color-t2)" }}>
              <span className="inline-block animate-pulse">
                {identityLoading ? "Verifying company identity..." : "Fetching filings from SEC EDGAR..."}
              </span>
            </div>
          </BioCard>
        )}

        {/* Identity validated → show filings */}
        {!identityLoading && !filingsLoading && identity?.validated && filings.length > 0 && (
          <>
            <div className="text-[9px] mb-1.5 flex items-center gap-1.5" style={{ color: "var(--color-t2)" }}>
              <span className="inline-block w-[5px] h-[5px] rounded-full" style={{ background: "#00e676" }} />
              SEC Verified: {identity.secCompanyName} (CIK {identity.cik}) — {filings.length} filings
            </div>
            <div className="rounded-lg mb-4" style={{ border: "1px solid var(--color-bd)", maxHeight: 300, overflowY: "auto", background: "var(--color-b1)" }}>
              {filings.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors no-underline"
                  style={{ borderBottom: i < filings.length - 1 ? "1px solid var(--color-bd)" : "none", display: "flex", color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bh)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span className="font-mono text-[10px] font-bold min-w-[52px] px-1.5 py-0.5 rounded text-center shrink-0"
                    style={{ color: fColor(f.type), background: `${fColor(f.type)}12`, border: `1px solid ${fColor(f.type)}25` }}>{f.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-0.5">{f.title}</div>
                    <div className="text-[8px] font-mono truncate" style={{ color: "var(--color-t2)" }}>
                      {f.url.replace("https://www.sec.gov/Archives/edgar/data/", "edgar/…/")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "var(--color-t2)" }}>{f.date}</span>
                    <span className="text-[10px]" style={{ color: "var(--color-a2)" }}>↗</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Identity validated but no filings */}
        {!identityLoading && !filingsLoading && identity?.validated && filings.length === 0 && secFound === true && (
          <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
            <div className="text-[9px] mb-1 flex items-center justify-center gap-1.5" style={{ color: "var(--color-t2)" }}>
              <span className="inline-block w-[5px] h-[5px] rounded-full" style={{ background: "#00e676" }} />
              SEC Verified: {identity.secCompanyName}
            </div>
            <div className="text-xs" style={{ color: "var(--color-t2)" }}>
              No recent 10-K, 10-Q, or 8-K filings found for <span className="font-mono font-semibold">{co.ticker}</span>.
            </div>
          </BioCard>
        )}

        {/* Identity mismatch — suppress data */}
        {!identityLoading && identity && !identity.validated && identity.cik && identity.validationMethod === "unvalidated" && (
          <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
            <div className="flex items-center justify-center gap-1.5 text-xs mb-1.5" style={{ color: "#ffb74d" }}>
              <span style={{ fontSize: 14 }}>⚠</span> Identity Mismatch
            </div>
            <div className="text-[10px] mb-1" style={{ color: "var(--color-t2)" }}>
              Ticker <span className="font-mono font-semibold">{co.ticker}</span> resolves to
              {" "}<span className="font-semibold">&ldquo;{identity.secCompanyName}&rdquo;</span> in SEC EDGAR (CIK {identity.cik}).
            </div>
            <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>
              SEC filings suppressed to prevent showing data from a different company.
            </div>
          </BioCard>
        )}

        {/* Ticker not found in SEC */}
        {!identityLoading && identity && !identity.validated && identity.validationMethod === "not_found" && (
          <BioCard style={{ padding: 20, textAlign: "center" }} className="mb-4">
            <div className="text-xs mb-1.5" style={{ color: "var(--color-t2)" }}>
              Ticker <span className="font-mono font-semibold">{co.ticker}</span> not found in SEC EDGAR.
            </div>
            <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>
              This company may file under a different name or may not have SEC reporting obligations.
            </div>
          </BioCard>
        )}
      </>}

      {/* International public companies — SEC not applicable */}
      {co.isPublic && !co.secEligible && (
        <div className="mb-4">
          <SectionHeader>SEC Filings & Financial Documents</SectionHeader>
          <BioCard style={{ padding: 20, textAlign: "center" }}>
            <div className="text-xs mb-1" style={{ color: "var(--color-t2)" }}>
              SEC filings are not available for <span className="font-semibold">{co.exchange}</span>-listed companies.
            </div>
            <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>
              {co.name} trades on {co.exchange} ({co.country}). SEC EDGAR only covers US-listed issuers.
            </div>
          </BioCard>
        </div>
      )}

      {/* Private/Acquired companies */}
      {!co.isPublic && (
        <div className="mb-4">
          <SectionHeader>Financial Documents</SectionHeader>
          <BioCard style={{ padding: 20, textAlign: "center" }}>
            <div className="text-xs" style={{ color: "var(--color-t2)" }}>
              {co.fundingStatus === "Acquired" ? "This company has been acquired — see parent company for financial filings." : "This is a private company — SEC filings are not available."}
            </div>
          </BioCard>
        </div>
      )}

      {/* Insider Trading Activity */}
      {co.isPublic && co.ticker && (
        <>
          <SectionHeader>Insider Trading Activity</SectionHeader>
          <InsiderTrading
            ticker={co.ticker}
            cik={identity?.cik ?? undefined}
            validated={identity?.validated}
            secEligible={co.secEligible}
            companyName={co.name}
          />
        </>
      )}

      {/* Catalyst Events */}
      <SectionHeader>Catalyst Events ({cat.length})</SectionHeader>
      {cat.length > 0 ? (
        <BioCard>
          {cat.map((c, i) => {
            const isPast = c.date < new Date().toISOString().slice(0, 10);
            return (
              <div key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < cat.length - 1 ? "1px solid var(--color-bd)" : "none", opacity: isPast ? 0.55 : 1 }}>
                <span className="font-mono text-[11px] font-semibold min-w-[80px]" style={{ color: isPast ? "var(--color-t2)" : "var(--color-ac)" }}>{c.date}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold">
                    <Link href={`/drugs/${c.drugId}`} className="hover:underline" style={{ color: "var(--color-a2)" }}>{c.drugName}</Link>
                    {" "}<span className="font-normal" style={{ color: "var(--color-t2)" }}>— {c.type}</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--color-t2)" }}>{c.indication}</div>
                </div>
                <Tag color="var(--color-a3)">{isPast ? "Past" : c.type}</Tag>
              </div>
            );
          })}
        </BioCard>
      ) : (
        <BioCard style={{ padding: 20, textAlign: "center" }}>
          <div className="text-xs" style={{ color: "var(--color-t2)" }}>No catalyst events scheduled.</div>
        </BioCard>
      )}
    </div>
  );
}
