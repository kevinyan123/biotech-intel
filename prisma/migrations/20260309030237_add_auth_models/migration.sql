-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ticker" TEXT,
    "description" TEXT,
    "scientificFocus" TEXT,
    "therapeuticAreas" TEXT,
    "founded" TEXT,
    "headquarters" TEXT,
    "website" TEXT,
    "marketCap" REAL,
    "stockPrice" REAL,
    "employees" INTEGER,
    "ceo" TEXT,
    "investors" TEXT,
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Drug_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClinicalTrial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicalTrial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pmid" TEXT,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "journal" TEXT,
    "publishDate" TEXT,
    "abstract" TEXT,
    "doi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FinancialData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "revenue" REAL,
    "netIncome" REAL,
    "marketCap" REAL,
    "stockPrice" REAL,
    "volume" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialData_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrugTrial" (
    "drugId" INTEGER NOT NULL,
    "trialId" INTEGER NOT NULL,

    PRIMARY KEY ("drugId", "trialId"),
    CONSTRAINT "DrugTrial_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DrugTrial_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrialPublication" (
    "trialId" INTEGER NOT NULL,
    "publicationId" INTEGER NOT NULL,

    PRIMARY KEY ("trialId", "publicationId"),
    CONSTRAINT "TrialPublication_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrialPublication_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyPublication" (
    "companyId" INTEGER NOT NULL,
    "publicationId" INTEGER NOT NULL,

    PRIMARY KEY ("companyId", "publicationId"),
    CONSTRAINT "CompanyPublication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompanyPublication_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalTrial_nctId_key" ON "ClinicalTrial"("nctId");

-- CreateIndex
CREATE UNIQUE INDEX "Publication_pmid_key" ON "Publication"("pmid");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialData_companyId_date_key" ON "FinancialData"("companyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
