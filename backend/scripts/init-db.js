import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = neon(url);

// Minimal schema to match `models/url.model.js`
await sql`
CREATE TABLE IF NOT EXISTS public.realurl_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(64) NOT NULL UNIQUE,
  target_url text NOT NULL,
  owner_id text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp
);
`;

await sql`CREATE INDEX IF NOT EXISTS realurl_urls_owner_id_idx ON public.realurl_urls (owner_id);`;

console.log("✅ DB ready: public.realurl_urls");

