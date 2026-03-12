import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

// Helps Node >= 20 fetch usage in serverless
neonConfig.fetchConnectionCache = true;

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL is not set (backend env).");
}

const sql = neon(dbUrl);
export const db = drizzle({ client: sql });

