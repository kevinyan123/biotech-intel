import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_PRISMA_URL environment variable is required");
  }
  const pool = new Pool({ connectionString });
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
