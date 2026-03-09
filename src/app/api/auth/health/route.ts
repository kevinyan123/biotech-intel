import { NextResponse } from "next/server";

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

  // 5. Try database connection
  try {
    const { prisma } = await import("@/lib/prisma");
    // Try a simple query to check if tables exist
    const userCount = await prisma.user.count();
    checks.database = { connected: true, userCount };
  } catch (err) {
    checks.database = {
      connected: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    checks,
  });
}
