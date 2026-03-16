import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Helpers ──────────────────────────────────────────────────────────────────

function firstJson(json: string | null | undefined): string | null {
  if (!json) return null;
  try {
    const arr = JSON.parse(json);
    if (Array.isArray(arr) && arr.length > 0) return String(arr[0]);
  } catch {
    // ignore
  }
  return null;
}

function firstDrugName(interventionsJson: string | null | undefined): string | null {
  if (!interventionsJson) return null;
  try {
    const arr = JSON.parse(interventionsJson) as { name: string; type: string }[];
    const drug = arr.find(
      (i) =>
        i.type === "DRUG" ||
        i.type === "BIOLOGICAL" ||
        i.type === "COMBINATION_PRODUCT"
    );
    return drug?.name ?? arr[0]?.name ?? null;
  } catch {
    return null;
  }
}

// ── GET /api/trials ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(sp.get("limit") ?? "50", 10)));
  const phaseFilter = sp.get("phase") || null;
  const statusFilter = sp.get("status") || null;
  const conditionFilter = sp.get("condition") || null;

  const where: Record<string, unknown> = {};
  if (phaseFilter) where.phase = phaseFilter;
  if (statusFilter) where.status = statusFilter;
  if (conditionFilter) {
    where.conditions = { contains: conditionFilter };
  }

  try {
    const [rows, total] = await Promise.all([
      (prisma as any).clinicalTrial.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { estimatedReadoutDate: "asc" },
          { createdAt: "desc" },
        ],
        include: {
          company: { select: { id: true, name: true } },
        },
      }),
      (prisma as any).clinicalTrial.count({ where }),
    ]);

    const data = rows.map((t: any) => ({
      nctId: t.nctId,
      title: t.title,
      phase: t.phase ?? "N/A",
      status: t.status ?? "Unknown",
      indication: firstJson(t.conditions),
      drugName: firstDrugName(t.interventions),
      companyId: t.companyId,
      companyName: t.company?.name ?? null,
      enrollment: t.enrollment,
      startDate: t.startDate,
      completionDate: t.completionDate,
      primaryCompletionDate: t.primaryCompletionDate,
      readoutDate: t.estimatedReadoutDate,
      readoutConfidence: t.readoutConfidence ?? "unknown",
      readoutSource: t.readoutSource,
      readoutSourceTier: t.readoutSourceTier,
      resultsAvailable: t.resultsAvailable,
    }));

    return NextResponse.json({
      data,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err: any) {
    console.error("GET /api/trials error:", err?.message);
    const msg = err?.message ?? "Internal error";
    const isDbError =
      msg.includes("does not exist") ||
      msg.includes("relation") ||
      msg.includes("No database URL");
    return NextResponse.json(
      {
        error: isDbError
          ? "Database not ready. Run the import script to populate trial data."
          : "Failed to fetch trials",
        data: [],
        page: 1,
        totalPages: 0,
        total: 0,
      },
      { status: isDbError ? 503 : 500 }
    );
  }
}
