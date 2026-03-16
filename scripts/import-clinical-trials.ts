/**
 * scripts/import-clinical-trials.ts
 *
 * Ingests interventional studies from ClinicalTrials.gov API v2 into
 * the Neon PostgreSQL database via Prisma.
 *
 * Usage:
 *   npx tsx scripts/import-clinical-trials.ts              # default: 10,000 studies
 *   npx tsx scripts/import-clinical-trials.ts --limit 500  # first 500 studies
 *   npx tsx scripts/import-clinical-trials.ts --all        # all studies (slow, ~300k)
 *   npx tsx scripts/import-clinical-trials.ts --status RECRUITING
 *   npx tsx scripts/import-clinical-trials.ts --phase PHASE2,PHASE3
 *
 * Environment:
 *   DATABASE_URL (or POSTGRES_PRISMA_URL, POSTGRES_URL) — set in .env
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

// ── CT.gov API Types ──────────────────────────────────────────────────────────

interface CTStudy {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
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
    descriptionModule?: { briefSummary?: string };
    conditionsModule?: { conditions?: string[] };
    armsInterventionsModule?: {
      interventions?: { name: string; type: string }[];
    };
    contactsLocationsModule?: {
      locations?: { facility?: string; city?: string; country?: string }[];
    };
    eligibilityModule?: { eligibilityCriteria?: string };
    sponsorCollaboratorsModule?: { leadSponsor?: { name: string } };
  };
  hasResults?: boolean;
}

interface CTResponse {
  studies: CTStudy[];
  nextPageToken?: string;
  totalCount?: number;
}

// ── Normalization helpers ─────────────────────────────────────────────────────

function normalizePhase(phases: string[] | undefined): string {
  if (!phases || phases.length === 0) return "N/A";
  const sorted = [...phases].sort();
  // Combined phases
  if (sorted.includes("PHASE1") && sorted.includes("PHASE2")) return "Phase 1/2";
  if (sorted.includes("PHASE2") && sorted.includes("PHASE3")) return "Phase 2/3";
  const map: Record<string, string> = {
    EARLY_PHASE1: "Phase 1",
    PHASE1: "Phase 1",
    PHASE2: "Phase 2",
    PHASE3: "Phase 3",
    PHASE4: "Approved",
    NA: "N/A",
  };
  return map[sorted[0]] ?? sorted[0];
}

function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    RECRUITING: "Recruiting",
    ACTIVE_NOT_RECRUITING: "Active",
    COMPLETED: "Completed",
    TERMINATED: "Terminated",
    NOT_YET_RECRUITING: "Not yet recruiting",
    ENROLLING_BY_INVITATION: "Active",
    SUSPENDED: "Terminated",
    WITHDRAWN: "Terminated",
    UNKNOWN: "Active",
    AVAILABLE: "Active",
    NO_LONGER_AVAILABLE: "Terminated",
    WITHHELD: "Terminated",
  };
  return map[status] ?? status;
}

function deriveReadout(study: CTStudy): {
  estimatedReadoutDate: string | null;
  readoutConfidence: "confirmed" | "estimated" | "unknown";
  readoutSource: string | null;
  readoutSourceTier: number | null;
} {
  const s = study.protocolSection.statusModule;

  if (s.resultsFirstPostedDateStruct?.date) {
    return {
      estimatedReadoutDate: s.resultsFirstPostedDateStruct.date,
      readoutConfidence: "confirmed",
      readoutSource: "ClinicalTrials.gov Results",
      readoutSourceTier: 1,
    };
  }
  if (study.hasResults && s.completionDateStruct?.date) {
    return {
      estimatedReadoutDate: s.completionDateStruct.date,
      readoutConfidence: "confirmed",
      readoutSource: "ClinicalTrials.gov",
      readoutSourceTier: 1,
    };
  }
  if (s.primaryCompletionDateStruct?.date) {
    return {
      estimatedReadoutDate: s.primaryCompletionDateStruct.date,
      readoutConfidence: "estimated",
      readoutSource: "Primary Completion Date",
      readoutSourceTier: 3,
    };
  }
  return {
    estimatedReadoutDate: null,
    readoutConfidence: "unknown",
    readoutSource: null,
    readoutSourceTier: null,
  };
}

function mapStudy(study: CTStudy) {
  const p = study.protocolSection;
  const s = p.statusModule;
  const interventions = p.armsInterventionsModule?.interventions ?? [];
  const locations = (p.contactsLocationsModule?.locations ?? [])
    .map((l) => [l.city, l.country].filter(Boolean).join(", "))
    .filter(Boolean);

  return {
    nctId: p.identificationModule.nctId,
    title: p.identificationModule.briefTitle.slice(0, 500),
    phase: normalizePhase(p.designModule?.phases),
    status: normalizeStatus(s.overallStatus),
    conditions: JSON.stringify(p.conditionsModule?.conditions ?? []),
    interventions: JSON.stringify(
      interventions.map((i) => ({ name: i.name, type: i.type }))
    ),
    sponsors: JSON.stringify(
      p.sponsorCollaboratorsModule?.leadSponsor?.name
        ? [p.sponsorCollaboratorsModule.leadSponsor.name]
        : []
    ),
    startDate: s.startDateStruct?.date ?? null,
    primaryCompletionDate: s.primaryCompletionDateStruct?.date ?? null,
    completionDate: s.completionDateStruct?.date ?? null,
    enrollment: p.designModule?.enrollmentInfo?.count ?? null,
    studyType: p.designModule?.studyType ?? null,
    locations: JSON.stringify(locations),
    resultsAvailable: study.hasResults ?? false,
    briefSummary: p.descriptionModule?.briefSummary?.slice(0, 2000) ?? null,
    sponsorName: p.sponsorCollaboratorsModule?.leadSponsor?.name ?? null,
    drugInterventions: interventions.filter(
      (i) => i.type === "DRUG" || i.type === "BIOLOGICAL" || i.type === "COMBINATION_PRODUCT"
    ),
    ...deriveReadout(study),
    lastSyncedAt: new Date(),
  };
}

// ── Prisma client factory ─────────────────────────────────────────────────────

function createClient(): PrismaClient {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) throw new Error("No DATABASE_URL found in environment");
  const sql = neon(url);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter });
}

// ── CT.gov API fetch ──────────────────────────────────────────────────────────

const CT_BASE = "https://clinicaltrials.gov/api/v2/studies";

async function fetchPage(
  pageToken: string | null,
  pageSize: number,
  statusFilter: string | null,
  phaseFilter: string | null
): Promise<CTResponse> {
  const params = new URLSearchParams({
    "filter.studyType": "INTERVENTIONAL",
    pageSize: String(pageSize),
    format: "json",
    // Fetch only fields we need to keep responses smaller
    fields: [
      "NCTId",
      "BriefTitle",
      "Phase",
      "OverallStatus",
      "StartDate",
      "PrimaryCompletionDate",
      "CompletionDate",
      "ResultsFirstPostedDate",
      "EnrollmentCount",
      "StudyType",
      "Condition",
      "Intervention",
      "LeadSponsorName",
      "BriefSummary",
      "HasResults",
      "LocationCity",
      "LocationCountry",
    ].join(","),
  });

  if (pageToken) params.set("pageToken", pageToken);
  if (statusFilter) params.set("filter.overallStatus", statusFilter);
  if (phaseFilter) params.set("filter.phase", phaseFilter);

  const url = `${CT_BASE}?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "KBY-Biotech-Intel/1.0 (research platform)" },
  });

  if (!res.ok) {
    throw new Error(`CT.gov API error: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<CTResponse>;
}

// ── Company cache & upsert ────────────────────────────────────────────────────

const companyCache = new Map<string, number>(); // normalized name → id

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,.]?\s*(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|gmbh|bv|ag|sa|plc|pty|nv)\.?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function upsertCompany(prisma: PrismaClient, sponsorName: string): Promise<number> {
  const key = normalizeName(sponsorName);
  if (companyCache.has(key)) return companyCache.get(key)!;

  // Try to find existing
  const existing = await (prisma as any).company.findFirst({
    where: { name: sponsorName },
    select: { id: true },
  });

  if (existing) {
    companyCache.set(key, existing.id);
    return existing.id;
  }

  const created = await (prisma as any).company.create({
    data: { name: sponsorName },
    select: { id: true },
  });

  companyCache.set(key, created.id);
  return created.id;
}

// ── Drug upsert ───────────────────────────────────────────────────────────────

const drugCache = new Map<string, number>(); // `${companyId}:${name}` → id

async function upsertDrug(
  prisma: PrismaClient,
  drugName: string,
  companyId: number
): Promise<number> {
  const key = `${companyId}:${drugName.toLowerCase()}`;
  if (drugCache.has(key)) return drugCache.get(key)!;

  const existing = await (prisma as any).drug.findFirst({
    where: { name: drugName, companyId },
    select: { id: true },
  });

  if (existing) {
    drugCache.set(key, existing.id);
    return existing.id;
  }

  const created = await (prisma as any).drug.create({
    data: {
      name: drugName,
      companyId,
      developmentStage: "Clinical",
    },
    select: { id: true },
  });

  drugCache.set(key, created.id);
  return created.id;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const isAll = args.includes("--all");
  const limitIdx = args.indexOf("--limit");
  const limit = isAll ? Infinity : limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10_000;
  const statusIdx = args.indexOf("--status");
  const statusFilter = statusIdx >= 0 ? args[statusIdx + 1] : null;
  const phaseIdx = args.indexOf("--phase");
  const phaseFilter = phaseIdx >= 0 ? args[phaseIdx + 1] : null;

  console.log("=== KBY Clinical Trials Importer ===");
  console.log(`Target: ${isAll ? "ALL" : limit.toLocaleString()} studies`);
  if (statusFilter) console.log(`Status filter: ${statusFilter}`);
  if (phaseFilter) console.log(`Phase filter: ${phaseFilter}`);
  console.log("");

  const prisma = createClient();

  let totalFetched = 0;
  let totalUpserted = 0;
  let totalSkipped = 0;
  let pageToken: string | null = null;
  let page = 1;
  const PAGE_SIZE = 1000;
  const startTime = Date.now();

  try {
    while (totalFetched < limit) {
      const remaining = Math.min(PAGE_SIZE, limit - totalFetched);
      process.stdout.write(`Page ${page} (fetching ${remaining})… `);

      let response: CTResponse;
      try {
        response = await fetchPage(pageToken, remaining, statusFilter, phaseFilter);
      } catch (err) {
        console.error(`\nFetch error on page ${page}:`, err);
        // Wait and retry once
        await new Promise((r) => setTimeout(r, 3000));
        response = await fetchPage(pageToken, remaining, statusFilter, phaseFilter);
      }

      const studies = response.studies ?? [];
      if (studies.length === 0) {
        console.log("no studies returned, stopping.");
        break;
      }

      // Process this batch
      let batchUpserted = 0;
      for (const study of studies) {
        try {
          const mapped = mapStudy(study);
          const { sponsorName, drugInterventions, ...trialData } = mapped;

          // Upsert company
          let companyId: number | null = null;
          if (sponsorName) {
            companyId = await upsertCompany(prisma, sponsorName);
          }

          // Upsert trial
          const trial = await (prisma as any).clinicalTrial.upsert({
            where: { nctId: trialData.nctId },
            create: { ...trialData, companyId },
            update: { ...trialData, companyId },
            select: { id: true },
          });

          // Upsert drug interventions and link to trial
          if (companyId && drugInterventions.length > 0) {
            for (const intervention of drugInterventions.slice(0, 3)) {
              // max 3 drugs per trial to avoid explosion
              const drugId = await upsertDrug(prisma, intervention.name, companyId);

              // Create DrugTrial link if not exists
              await (prisma as any).drugTrial.upsert({
                where: { drugId_trialId: { drugId, trialId: trial.id } },
                create: { drugId, trialId: trial.id },
                update: {},
              });
            }
          }

          batchUpserted++;
          totalUpserted++;
        } catch {
          totalSkipped++;
        }
      }

      totalFetched += studies.length;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (totalUpserted / parseFloat(elapsed)).toFixed(0);
      console.log(`✓ ${batchUpserted} upserted | total: ${totalUpserted.toLocaleString()} | ${rate}/s`);

      // Check if there are more pages
      if (!response.nextPageToken) {
        console.log("\nNo more pages — import complete.");
        break;
      }
      pageToken = response.nextPageToken;
      page++;

      // Small delay to be respectful to the API
      if (page % 10 === 0) await new Promise((r) => setTimeout(r, 500));
    }
  } finally {
    await (prisma as any).$disconnect();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n=== Import Summary ===");
  console.log(`Total fetched:  ${totalFetched.toLocaleString()}`);
  console.log(`Total upserted: ${totalUpserted.toLocaleString()}`);
  console.log(`Skipped/error:  ${totalSkipped.toLocaleString()}`);
  console.log(`Time elapsed:   ${elapsed}s`);
  console.log(`Companies in cache: ${companyCache.size}`);
  console.log(`Drugs in cache:     ${drugCache.size}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
