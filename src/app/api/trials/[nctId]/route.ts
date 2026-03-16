import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/trials/[nctId] ───────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nctId: string }> }
) {
  const { nctId } = await params;

  if (!nctId || !/^NCT\d{8}$/i.test(nctId)) {
    return NextResponse.json(
      { error: "Invalid NCT ID format. Expected: NCT########" },
      { status: 400 }
    );
  }

  try {
    const trial = await (prisma as any).clinicalTrial.findUnique({
      where: { nctId: nctId.toUpperCase() },
      include: {
        company: { select: { id: true, name: true } },
        drugs: {
          include: {
            drug: { select: { id: true, name: true, mechanismOfAction: true } },
          },
          take: 3,
        },
      },
    });

    if (!trial) {
      return NextResponse.json({ error: "Trial not found" }, { status: 404 });
    }

    // Parse JSON arrays
    let conditions: string[] = [];
    let interventions: { name: string; type: string }[] = [];
    let locations: string[] = [];
    let sponsors: string[] = [];

    try { conditions = JSON.parse(trial.conditions ?? "[]"); } catch { /* ignore */ }
    try { interventions = JSON.parse(trial.interventions ?? "[]"); } catch { /* ignore */ }
    try { locations = JSON.parse(trial.locations ?? "[]"); } catch { /* ignore */ }
    try { sponsors = JSON.parse(trial.sponsors ?? "[]"); } catch { /* ignore */ }

    // First drug/biological intervention
    const primaryDrug =
      interventions.find(
        (i) =>
          i.type === "DRUG" ||
          i.type === "BIOLOGICAL" ||
          i.type === "COMBINATION_PRODUCT"
      ) ?? interventions[0];

    return NextResponse.json({
      nctId: trial.nctId,
      title: trial.title,
      phase: trial.phase ?? "N/A",
      status: trial.status ?? "Unknown",
      indication: conditions[0] ?? null,
      conditions,
      drugName: primaryDrug?.name ?? null,
      interventions,
      sponsors,
      companyId: trial.companyId,
      companyName: trial.company?.name ?? null,
      enrollment: trial.enrollment,
      studyType: trial.studyType,
      startDate: trial.startDate,
      primaryCompletionDate: trial.primaryCompletionDate,
      completionDate: trial.completionDate,
      readoutDate: trial.estimatedReadoutDate,
      readoutConfidence: trial.readoutConfidence ?? "unknown",
      readoutSource: trial.readoutSource,
      readoutSourceTier: trial.readoutSourceTier,
      resultsAvailable: trial.resultsAvailable,
      briefSummary: trial.briefSummary,
      locations,
      lastSyncedAt: trial.lastSyncedAt,
      createdAt: trial.createdAt,
      // Linked drugs (from DrugTrial join)
      linkedDrugs: trial.drugs.map((dt: any) => ({
        id: dt.drug.id,
        name: dt.drug.name,
        mechanismOfAction: dt.drug.mechanismOfAction,
      })),
    });
  } catch (err: any) {
    console.error(`GET /api/trials/${nctId} error:`, err?.message);
    const msg = err?.message ?? "Internal error";
    const isDbError =
      msg.includes("does not exist") ||
      msg.includes("relation") ||
      msg.includes("No database URL");
    return NextResponse.json(
      {
        error: isDbError
          ? "Database not ready. Import clinical trials data first."
          : "Failed to fetch trial",
      },
      { status: isDbError ? 503 : 500 }
    );
  }
}
