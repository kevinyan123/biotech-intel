// scripts/db-push.mjs — Conditionally run prisma db push during Vercel builds
import { execSync } from "child_process";

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

const found = envVarNames.filter((name) => !!process.env[name]);

console.log("\n=== Database Push ===");
console.log("Environment vars found:", found.length ? found.join(", ") : "NONE");

if (found.length === 0) {
  console.log("No database URL found — skipping prisma db push.");
  console.log("Tables will NOT be created. Set a DATABASE_URL to enable.\n");
  process.exit(0);
}

console.log("Running: prisma db push --skip-generate --accept-data-loss");

try {
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });
  console.log("Database push succeeded!\n");
} catch (err) {
  console.error("\nDatabase push FAILED!");
  console.error("This means auth tables may not exist in the database.");
  console.error("Error:", err.message);
  // Don't fail the build — the app can still run without auth tables
  // But log clearly so we know what happened
  console.error("Continuing build despite db push failure...\n");
  process.exit(0);
}
