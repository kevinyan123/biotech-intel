const BASE_URL = "https://efts.sec.gov/LATEST";
const EDGAR_BASE = "https://www.sec.gov/cgi-bin/browse-edgar";

export interface SECFiling {
  id: string;
  entity_name: string;
  file_num: string;
  form_type: string;
  filed_at: string;
  period_of_report: string;
}

export async function searchCompanyFilings(
  companyName: string,
  limit = 10
): Promise<SECFiling[]> {
  const params = new URLSearchParams({
    q: `"${companyName}"`,
    dateRange: "custom",
    startdt: "2023-01-01",
    enddt: new Date().toISOString().split("T")[0],
    forms: "10-K,10-Q,8-K,S-1",
  });

  try {
    const res = await fetch(`${BASE_URL}/search-index?${params}`, {
      headers: {
        "User-Agent": "BiotechIntel research@biotechintel.local",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits || []).slice(0, limit).map(
      (hit: { _source: SECFiling }) => hit._source
    );
  } catch {
    return [];
  }
}

export function getEdgarSearchUrl(companyName: string): string {
  const params = new URLSearchParams({
    company: companyName,
    CIK: "",
    type: "10-K",
    dateb: "",
    owner: "include",
    count: "10",
    search_text: "",
    action: "getcompany",
  });
  return `${EDGAR_BASE}?${params}`;
}

export function getEdgarFilingUrl(cik: string): string {
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=&dateb=&owner=include&count=40`;
}
