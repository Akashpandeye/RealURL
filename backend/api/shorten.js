import { nanoid } from "nanoid";
import { requireClerkUser } from "../middleware/clerkAuth.js";
import { createUrl } from "../services/url.service.js";
import { shortenBodySchema } from "../validation/request.validation.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, error } = await requireClerkUser(req);
  if (error) return res.status(401).json({ error });

  const parsed = await shortenBodySchema.safeParseAsync(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { url, code } = parsed.data;
  const shortCode = code ?? nanoid(6);

  try {
    const result = await createUrl({ targetUrl: url, shortCode, ownerId: userId });
    return res.status(201).json({ data: { result } });
  } catch (e) {
    if (e?.code === "23505") return res.status(400).json({ error: "Short code already exists" });
    return res.status(500).json({ error: "Internal Server Error", message: e?.message || String(e) });
  }
}

