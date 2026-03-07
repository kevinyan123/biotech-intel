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
  return {
    nctId: p.identificationModule.nctId,
    title: p.identificationModule.briefTitle,
    phase: p.designModule?.phases?.join(", ") || "N/A",
    status: p.statusModule.overallStatus,
    conditions: p.conditionsModule?.conditions || [],
    interventions:
      p.armsInterventionsModule?.interventions?.map((i) => i.name) || [],
    sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name || "N/A",
    startDate: p.statusModule.startDateStruct?.date || "N/A",
    completionDate: p.statusModule.completionDateStruct?.date || null,
    enrollment: p.designModule?.enrollmentInfo?.count || null,
    studyType: p.designModule?.studyType || "N/A",
    briefSummary: p.descriptionModule?.briefSummary || null,
    hasResults: study.hasResults || false,
    locations:
      p.contactsLocationsModule?.locations?.map(
        (l) => `${l.city}, ${l.country}`
      ) || [],
  };
}
