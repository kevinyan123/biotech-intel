const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

interface PubMedSearchResult {
  esearchresult: {
    idlist: string[];
    count: string;
  };
}

interface PubMedArticle {
  uid: string;
  title: string;
  sortfirstauthor: string;
  authors: { name: string }[];
  source: string;
  pubdate: string;
  elocationid?: string;
}

interface PubMedSummaryResult {
  result: {
    uids: string[];
    [uid: string]: PubMedArticle | string[];
  };
}

export interface PubMedPublication {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publishDate: string;
  doi: string | null;
}

export async function searchPublications(
  query: string,
  maxResults = 10
): Promise<PubMedPublication[]> {
  // Step 1: Search for IDs
  const searchParams = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmax: String(maxResults),
    retmode: "json",
    sort: "date",
  });

  try {
    const searchRes = await fetch(`${BASE_URL}/esearch.fcgi?${searchParams}`, {
      next: { revalidate: 3600 },
    });
    if (!searchRes.ok) return [];
    const searchData: PubMedSearchResult = await searchRes.json();
    const ids = searchData.esearchresult.idlist;
    if (ids.length === 0) return [];

    // Step 2: Fetch summaries
    const summaryParams = new URLSearchParams({
      db: "pubmed",
      id: ids.join(","),
      retmode: "json",
    });

    const summaryRes = await fetch(
      `${BASE_URL}/esummary.fcgi?${summaryParams}`,
      { next: { revalidate: 3600 } }
    );
    if (!summaryRes.ok) return [];
    const summaryData: PubMedSummaryResult = await summaryRes.json();

    return ids.map((id) => {
      const article = summaryData.result[id] as PubMedArticle;
      return {
        pmid: id,
        title: article.title || "",
        authors: article.authors?.map((a) => a.name) || [],
        journal: article.source || "",
        publishDate: article.pubdate || "",
        doi: article.elocationid?.replace("doi: ", "") || null,
      };
    });
  } catch {
    return [];
  }
}

export async function getArticleAbstract(pmid: string): Promise<string | null> {
  const params = new URLSearchParams({
    db: "pubmed",
    id: pmid,
    rettype: "abstract",
    retmode: "text",
  });

  try {
    const res = await fetch(`${BASE_URL}/efetch.fcgi?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}
