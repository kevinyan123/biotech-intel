import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStatusColor, getPhaseColor } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const search = `%${q}%`;

  const [companies, drugs, trials] = await Promise.all([
    prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { ticker: { contains: q } },
          { therapeuticAreas: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 10,
    }),
    prisma.drug.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { genericName: { contains: q } },
          { drugClass: { contains: q } },
          { therapeuticArea: { contains: q } },
        ],
      },
      include: { company: true },
      take: 10,
    }),
    prisma.clinicalTrial.findMany({
      where: {
        OR: [
          { nctId: { contains: q } },
          { title: { contains: q } },
          { conditions: { contains: q } },
          { sponsors: { contains: q } },
        ],
      },
      include: { company: true },
      take: 10,
    }),
  ]);

  const results = [
    ...companies.map((c) => ({
      type: "company" as const,
      id: c.id,
      title: c.name,
      subtitle: `${c.ticker ? c.ticker + " · " : ""}${c.headquarters || ""}`,
      badges: [] as { label: string; color: string }[],
      href: `/companies/${c.id}`,
    })),
    ...drugs.map((d) => ({
      type: "drug" as const,
      id: d.id,
      title: d.name,
      subtitle: `${d.company.name} · ${d.therapeuticArea || ""}`,
      badges: d.developmentStage
        ? [{ label: d.developmentStage, color: getStatusColor(d.developmentStage) }]
        : [],
      href: `/drugs/${d.id}`,
    })),
    ...trials.map((t) => ({
      type: "trial" as const,
      id: t.id,
      title: t.nctId,
      subtitle: t.title,
      badges: [
        ...(t.phase ? [{ label: t.phase, color: getPhaseColor(t.phase) }] : []),
        ...(t.status ? [{ label: t.status, color: getStatusColor(t.status) }] : []),
      ],
      href: `/trials/${t.id}`,
    })),
  ];

  return NextResponse.json({ results });
}
