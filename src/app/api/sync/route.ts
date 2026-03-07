import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchTrials, mapCTStudy } from "@/lib/api/clinicaltrials";

export async function POST() {
  const results: string[] = [];

  try {
    // Sync trials from ClinicalTrials.gov for each company
    const companies = await prisma.company.findMany();

    for (const company of companies) {
      const shortName = company.name.replace(/,?\s*(Inc\.|SE|AG|Ltd\.).*$/, "").trim();
      const studies = await searchTrials(shortName, 5);

      for (const study of studies) {
        const mapped = mapCTStudy(study);

        await prisma.clinicalTrial.upsert({
          where: { nctId: mapped.nctId },
          update: {
            status: mapped.status,
            phase: mapped.phase,
            enrollment: mapped.enrollment,
            completionDate: mapped.completionDate,
          },
          create: {
            nctId: mapped.nctId,
            title: mapped.title,
            phase: mapped.phase,
            status: mapped.status,
            conditions: JSON.stringify(mapped.conditions),
            interventions: JSON.stringify(mapped.interventions),
            sponsors: mapped.sponsor,
            startDate: mapped.startDate,
            completionDate: mapped.completionDate,
            enrollment: mapped.enrollment,
            studyType: mapped.studyType,
            briefSummary: mapped.briefSummary,
            locations: JSON.stringify(mapped.locations),
            resultsAvailable: mapped.hasResults,
            companyId: company.id,
          },
        });
      }

      results.push(`Synced ${studies.length} trials for ${company.name}`);
    }

    return NextResponse.json({
      success: true,
      message: "Data sync completed",
      details: results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
