"use client";

import BioCard from "@/components/ui/BioCard";

const dataSources = [
  {
    name: "ClinicalTrials.gov",
    url: "https://clinicaltrials.gov",
    apiUrl: "https://clinicaltrials.gov/api/v2",
    description: "U.S. National Library of Medicine registry of clinical studies conducted around the world.",
    dataProvided: ["Clinical trial metadata", "Study design", "Eligibility criteria", "Trial results", "Recruitment status"],
    updateFrequency: "Real-time (API-based)",
  },
  {
    name: "OpenFDA",
    url: "https://open.fda.gov",
    apiUrl: "https://api.fda.gov",
    description: "FDA's open-access database providing data on drugs, devices, and food.",
    dataProvided: ["Drug labeling", "Adverse events", "Drug approvals", "Regulatory information"],
    updateFrequency: "Weekly",
  },
  {
    name: "PubMed / NCBI",
    url: "https://pubmed.ncbi.nlm.nih.gov",
    apiUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
    description: "National Center for Biotechnology Information literature database.",
    dataProvided: ["Publication metadata", "Abstracts", "Author information", "DOI links"],
    updateFrequency: "Daily",
  },
  {
    name: "SEC EDGAR",
    url: "https://www.sec.gov/edgar",
    apiUrl: "https://efts.sec.gov/LATEST",
    description: "U.S. Securities and Exchange Commission electronic filing system.",
    dataProvided: ["Company filings (10-K, 10-Q)", "Financial statements", "Insider trading data"],
    updateFrequency: "Real-time",
  },
];

export default function SourcesPage() {
  return (
    <div style={{ animation: "fi .2s ease-out" }}>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Data Sources</h1>
        <p className="mt-1 text-[11px]" style={{ color: "var(--color-t2)" }}>
          All data comes from official public APIs and databases.
        </p>
      </div>

      <div className="space-y-3">
        {dataSources.map((source) => (
          <BioCard key={source.name}>
            <div className="text-sm font-bold mb-2">{source.name}</div>
            <p className="text-[11px] mb-3" style={{ color: "var(--color-t1)" }}>{source.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-t2)" }}>Website</div>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] hover:underline" style={{ color: "var(--color-a2)" }}>{source.url}</a>
              </div>
              <div>
                <div className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-t2)" }}>API</div>
                <code className="text-[10px] font-mono" style={{ color: "var(--color-t1)" }}>{source.apiUrl}</code>
              </div>
              <div>
                <div className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-t2)" }}>Frequency</div>
                <div className="text-[11px]">{source.updateFrequency}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[8px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--color-t2)" }}>Data Provided</div>
              <div className="grid grid-cols-2 gap-0.5">
                {source.dataProvided.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-t1)" }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--color-a2)" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </BioCard>
        ))}
      </div>

      <BioCard className="mt-4">
        <div className="text-sm font-bold mb-2">About KBY Biotech Index</div>
        <div className="space-y-2 text-[11px]" style={{ color: "var(--color-t1)" }}>
          <p>KBY Biotech Index is a research-focused biotech intelligence platform that aggregates publicly available data from official sources.</p>
          <p>Designed for researchers, analysts, and investors who need structured access to biotech company data, drug pipelines, clinical trials, and financial information.</p>
        </div>
      </BioCard>
    </div>
  );
}
