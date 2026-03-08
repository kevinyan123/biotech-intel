import { NextRequest, NextResponse } from "next/server";
import { getTrialByNCT, mapCTStudy } from "@/lib/api/clinicaltrials";

// In-memory cache: nctId → { data, timestamp }
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(req: NextRequest) {
  const nctId = req.nextUrl.searchParams.get("nctId")?.trim().toUpperCase();
  if (!nctId || !/^NCT\d{8}$/.test(nctId)) {
    return NextResponse.json(
      { error: "Missing or invalid ?nctId= (format: NCT########)" },
      { status: 400 }
    );
  }

  // Check cache
  const cached = cache.get(nctId);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const study = await getTrialByNCT(nctId);
    if (!study) {
      const notFound = {
        found: false,
        nctId,
        readoutDate: null,
        readoutConfidence: "unknown" as const,
        readoutSource: null,
        readoutSourceTier: null,
      };
      cache.set(nctId, { data: notFound, ts: Date.now() });
      return NextResponse.json(notFound);
    }

    const mapped = mapCTStudy(study);
    const response = {
      found: true,
      nctId: mapped.nctId,
      title: mapped.title,
      status: mapped.status,
      readoutDate: mapped.readoutDate,
      readoutConfidence: mapped.readoutConfidence,
      readoutSource: mapped.readoutSource,
      readoutSourceTier: mapped.readoutSourceTier,
      completionDate: mapped.completionDate,
      hasResults: mapped.hasResults,
    };

    cache.set(nctId, { data: response, ts: Date.now() });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Trial readout API error:", err?.message);
    return NextResponse.json({
      found: false,
      nctId,
      readoutDate: null,
      readoutConfidence: "unknown",
      readoutSource: null,
      readoutSourceTier: null,
      error: err?.message,
    });
  }
}
