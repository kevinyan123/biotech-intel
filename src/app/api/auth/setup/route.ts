import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

export async function GET(req: NextRequest) {
  // Require a secret key to prevent unauthorized access
  const secret = req.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.SETUP_SECRET || process.env.JWT_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return NextResponse.json({ error: "No database URL found" }, { status: 500 });
  }

  const sql = neon(dbUrl);
  const results: string[] = [];

  try {
    // Create User table
    await sql`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `;
    results.push("User table created");

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`;
    results.push("User email index created");

    // Create PasswordResetToken table
    await sql`
      CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "usedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("PasswordResetToken table created");

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken"("token")`;
    results.push("PasswordResetToken token index created");

    // Create Company table
    await sql`
      CREATE TABLE IF NOT EXISTS "Company" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "ticker" TEXT,
        "description" TEXT,
        "scientificFocus" TEXT,
        "therapeuticAreas" TEXT,
        "founded" TEXT,
        "headquarters" TEXT,
        "website" TEXT,
        "marketCap" DOUBLE PRECISION,
        "stockPrice" DOUBLE PRECISION,
        "employees" INTEGER,
        "ceo" TEXT,
        "investors" TEXT,
        "logoUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
      )
    `;
    results.push("Company table created");

    // Create Drug table
    await sql`
      CREATE TABLE IF NOT EXISTS "Drug" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "genericName" TEXT,
        "drugClass" TEXT,
        "mechanismOfAction" TEXT,
        "therapeuticArea" TEXT,
        "developmentStage" TEXT,
        "regulatoryStatus" TEXT,
        "approvalDate" TEXT,
        "description" TEXT,
        "companyId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Drug_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Drug_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("Drug table created");

    // Create ClinicalTrial table
    await sql`
      CREATE TABLE IF NOT EXISTS "ClinicalTrial" (
        "id" SERIAL NOT NULL,
        "nctId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "phase" TEXT,
        "status" TEXT,
        "conditions" TEXT,
        "interventions" TEXT,
        "sponsors" TEXT,
        "startDate" TEXT,
        "completionDate" TEXT,
        "enrollment" INTEGER,
        "studyType" TEXT,
        "locations" TEXT,
        "resultsAvailable" BOOLEAN NOT NULL DEFAULT false,
        "briefSummary" TEXT,
        "eligibility" TEXT,
        "companyId" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ClinicalTrial_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "ClinicalTrial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `;
    results.push("ClinicalTrial table created");

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "ClinicalTrial_nctId_key" ON "ClinicalTrial"("nctId")`;
    results.push("ClinicalTrial nctId index created");

    // Create Publication table
    await sql`
      CREATE TABLE IF NOT EXISTS "Publication" (
        "id" SERIAL NOT NULL,
        "pmid" TEXT,
        "title" TEXT NOT NULL,
        "authors" TEXT,
        "journal" TEXT,
        "publishDate" TEXT,
        "abstract" TEXT,
        "doi" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
      )
    `;
    results.push("Publication table created");

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "Publication_pmid_key" ON "Publication"("pmid")`;
    results.push("Publication pmid index created");

    // Create FinancialData table
    await sql`
      CREATE TABLE IF NOT EXISTS "FinancialData" (
        "id" SERIAL NOT NULL,
        "companyId" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "revenue" DOUBLE PRECISION,
        "netIncome" DOUBLE PRECISION,
        "marketCap" DOUBLE PRECISION,
        "stockPrice" DOUBLE PRECISION,
        "volume" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FinancialData_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "FinancialData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("FinancialData table created");

    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "FinancialData_companyId_date_key" ON "FinancialData"("companyId", "date")`;
    results.push("FinancialData compound index created");

    // Create DrugTrial join table
    await sql`
      CREATE TABLE IF NOT EXISTS "DrugTrial" (
        "drugId" INTEGER NOT NULL,
        "trialId" INTEGER NOT NULL,
        CONSTRAINT "DrugTrial_pkey" PRIMARY KEY ("drugId", "trialId"),
        CONSTRAINT "DrugTrial_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "DrugTrial_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("DrugTrial table created");

    // Create TrialPublication join table
    await sql`
      CREATE TABLE IF NOT EXISTS "TrialPublication" (
        "trialId" INTEGER NOT NULL,
        "publicationId" INTEGER NOT NULL,
        CONSTRAINT "TrialPublication_pkey" PRIMARY KEY ("trialId", "publicationId"),
        CONSTRAINT "TrialPublication_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "TrialPublication_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("TrialPublication table created");

    // Create CompanyPublication join table
    await sql`
      CREATE TABLE IF NOT EXISTS "CompanyPublication" (
        "companyId" INTEGER NOT NULL,
        "publicationId" INTEGER NOT NULL,
        CONSTRAINT "CompanyPublication_pkey" PRIMARY KEY ("companyId", "publicationId"),
        CONSTRAINT "CompanyPublication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "CompanyPublication_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `;
    results.push("CompanyPublication table created");

    // Verify tables
    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
    const tableNames = tables.map((t: Record<string, string>) => t.tablename);

    return NextResponse.json({
      success: true,
      results,
      tables: tableNames,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      results,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
