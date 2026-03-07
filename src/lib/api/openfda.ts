const BASE_URL = "https://api.fda.gov/drug";

export interface FDADrugResult {
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_type?: string[];
    route?: string[];
    substance_name?: string[];
    pharm_class_epc?: string[];
    pharm_class_moa?: string[];
  };
  products?: {
    brand_name: string;
    active_ingredients: { name: string; strength: string }[];
    dosage_form: string;
    route: string;
    marketing_status: string;
  }[];
}

export async function searchDrugs(query: string, limit = 10): Promise<FDADrugResult[]> {
  const params = new URLSearchParams({
    search: `openfda.brand_name:"${query}"+openfda.generic_name:"${query}"`,
    limit: String(limit),
  });

  try {
    const res = await fetch(`${BASE_URL}/drugsfda.json?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export interface FDAAdverseEvent {
  safetyreportid: string;
  receivedate: string;
  serious: string;
  patient: {
    reaction: { reactionmeddrapt: string }[];
    drug: { medicinalproduct: string; drugindication: string }[];
  };
}

export async function getAdverseEvents(
  drugName: string,
  limit = 5
): Promise<FDAAdverseEvent[]> {
  const params = new URLSearchParams({
    search: `patient.drug.medicinalproduct:"${drugName}"`,
    limit: String(limit),
  });

  try {
    const res = await fetch(`${BASE_URL}/event.json?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export async function getDrugLabeling(drugName: string) {
  const params = new URLSearchParams({
    search: `openfda.brand_name:"${drugName}"`,
    limit: "1",
  });

  try {
    const res = await fetch(`${BASE_URL}/label.json?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}
