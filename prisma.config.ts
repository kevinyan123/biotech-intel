import "dotenv/config";
import { defineConfig } from "prisma/config";

// Check all possible Vercel/Neon env var names (including custom prefixes)
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRISMA_URL ||
  process.env.DATABASE_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.STORAGE_PRISMA_URL ||
  process.env.STORAGE_URL ||
  process.env.STORAGE_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL;

// Log which env var was found (helpful for debugging Vercel builds)
const envVarNames = [
  "DATABASE_URL", "DATABASE_PRISMA_URL", "DATABASE_URL_NON_POOLING",
  "POSTGRES_PRISMA_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING",
  "STORAGE_PRISMA_URL", "STORAGE_URL", "STORAGE_URL_NON_POOLING",
  "NEON_DATABASE_URL",
];
const foundVars = envVarNames.filter((name) => !!process.env[name]);
console.log("[prisma.config] Found database env vars:", foundVars.length ? foundVars.join(", ") : "NONE");

if (!databaseUrl) {
  console.error("[prisma.config] ERROR: No database URL found! Set DATABASE_URL or connect a Neon database in Vercel.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
