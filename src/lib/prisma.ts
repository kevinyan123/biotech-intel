import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getDatabaseUrl(): string {
  // Check all common Vercel/Neon env var names (including custom prefixes)
  const url =
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
  if (!url) {
    throw new Error(
      "No database URL found. Set DATABASE_URL or connect a Neon Postgres database in Vercel."
    );
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: getDatabaseUrl() });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

/** Lazy-loaded Prisma client — only connects on first use, not at import time */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return (globalForPrisma.prisma as Record<string | symbol, unknown>)[prop];
  },
});
