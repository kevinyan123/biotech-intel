const BASE_URL = "https://clinicaltrials.gov/api/v2";

export interface CTStudy {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
      organization?: { fullName: string };
    };
    statusModule: {
      overallStatus: string;
      startDateStruct?: { date: string };
      completionDateStruct?: { date: string };
      primaryCompletionDateStruct?: { date: string; type?: string };
      resultsFirstPostedDateStruct?: { date: string };
    };
    designModule?: {
      phases?: string[];
      studyType?: string;
      enrollmentInfo?: { count: number };
    };
    descriptionModule?: {
      briefSummary?: string;
    };
    conditionsModule?: {
      conditions?: string[];
    };
    armsInterventionsModule?: {
      interventions?: { name: string; type: string }[];
    };
    contactsLocationsModule?: {
      locations?: { facility: string; city: string; country: string }[];
    };
    eligibilityModule?: {
      eligibilityCriteria?: string;
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name: string };
    };
  };
  hasResults?: boolean;
  resultsSection?: Record<string, unknown>;
}

export async function searchTrials(
  query: string,
  pageSize = 10
): Promise<CTStudy[]> {
  const params = new URLSearchParams({
    "query.term": query,
    pageSize: String(pageSize),
    format: "json",
  });

  const res = await fetch(`${BASE_URL}/studies?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.studies || [];
}

export async function getTrialByNCT(nctId: string): Promise<CTStudy | null> {
  const res = await fetch(`${BASE_URL}/studies/${nctId}?format=json`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}

export function mapCTStudy(study: CTStudy) {
  const p = study.protocolSection;
  const s = p.statusModule;

  // ── Readout date extraction with tier priority ──
  // Tier 1: resultsFirstPostedDate (actual results posted to ClinicalTrials.gov)
  // Tier 3: primaryCompletionDate (estimated date primary outcome data available)
  // If neither → unknown
  let readoutDate: string | null = null;
  let readoutConfidence: "confirmed" | "estimated" | "unknown" = "unknown";
  let readoutSource: string | null = null;
  let readoutSourceTier: 1 | 2 | 3 | null = null;

  if (s.resultsFirstPostedDateStruct?.date) {
    readoutDate = s.resultsFirstPostedDateStruct.date;
    readoutConfidence = "confirmed";
    readoutSource = "ClinicalTrials.gov Results";
    readoutSourceTier = 1;
  } else if (study.hasResults) {
    // Has results flag but no posted date — still confirmed from CT.gov
    readoutDate = s.completionDateStruct?.date || null;
    readoutConfidence = readoutDate ? "confirmed" : "unknown";
    readoutSource = readoutDate ? "ClinicalTrials.gov" : null;
    readoutSourceTier = readoutDate ? 1 : null;
  } else if (s.primaryCompletionDateStruct?.date) {
    readoutDate = s.primaryCompletionDateStruct.date;
    readoutConfidence = "estimated";
    readoutSource = "Primary Completion Date";
    readoutSourceTier = 3;
  }

  return {
    nctId: p.identificationModule.nctId,
    title: p.identificationModule.briefTitle,
    phase: p.designModule?.phases?.join(", ") || "N/A",
    status: s.overallStatus,
    conditions: p.conditionsModule?.conditions || [],
    interventions:
      p.armsInterventionsModule?.interventions?.map((i) => i.name) || [],
    sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name || "N/A",
    startDate: s.startDateStruct?.date || "N/A",
    completionDate: s.completionDateStruct?.date || null,
    enrollment: p.designModule?.enrollmentInfo?.count || null,
    studyType: p.designModule?.studyType || "N/A",
    briefSummary: p.descriptionModule?.briefSummary || null,
    hasResults: study.hasResults || false,
    locations:
      p.contactsLocationsModule?.locations?.map(
        (l) => `${l.city}, ${l.country}`
      ) || [],
    // Readout date info with source tracking
    readoutDate,
    readoutConfidence,
    readoutSource,
    readoutSourceTier,
  };
}
