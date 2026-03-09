import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // 1. Check which database env vars exist (names only, not values)
  const envVarNames = [
    "DATABASE_URL",
    "DATABASE_PRISMA_URL",
    "DATABASE_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "STORAGE_PRISMA_URL",
    "STORAGE_URL",
    "STORAGE_URL_NON_POOLING",
    "NEON_DATABASE_URL",
  ];
  const foundEnvVars = envVarNames.filter((name) => !!process.env[name]);
  checks.databaseEnvVars = foundEnvVars.length ? foundEnvVars : "NONE FOUND";

  // 2. Check JWT_SECRET
  checks.jwtSecret = process.env.JWT_SECRET ? "SET" : "NOT SET (using fallback)";

  // 3. Check RESEND_API_KEY
  checks.resendApiKey = process.env.RESEND_API_KEY ? "SET" : "NOT SET";

  // 4. Check NEXT_PUBLIC_APP_URL
  checks.appUrl = process.env.NEXT_PUBLIC_APP_URL || "NOT SET";

  // 5. Try raw SQL connection (HTTP-based, most reliable test)
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      const result = await sql`SELECT 1 as test`;
      checks.rawConnection = { success: true, result: result[0] };
    } catch (err) {
      checks.rawConnection = {
        success: false,
        error: err instanceof Error ? err.message : JSON.stringify(err),
        stack: err instanceof Error ? err.stack?.split("\n").slice(0, 3) : undefined,
      };
    }

    // 6. Check if User table exists
    try {
      const sql = neon(dbUrl);
      const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
      checks.tables = tables.map((t: Record<string, string>) => t.tablename);
    } catch (err) {
      checks.tables = {
        error: err instanceof Error ? err.message : JSON.stringify(err),
      };
    }
  }

  // 7. Try Prisma connection
  try {
    const { prisma } = await import("@/lib/prisma");
    const userCount = await prisma.user.count();
    checks.prisma = { connected: true, userCount };
  } catch (err) {
    checks.prisma = {
      connected: false,
      error: err instanceof Error ? err.message : JSON.stringify(err),
      type: err?.constructor?.name,
    };
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    checks,
  });
}
