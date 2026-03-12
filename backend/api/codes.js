import { requireClerkUser } from "../middleware/clerkAuth.js";
import { listUrlsByOwner } from "../services/url.service.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { userId, error } = await requireClerkUser(req);
  if (error) return res.status(401).json({ error });

  try {
    const result = await listUrlsByOwner(userId);
    return res.status(200).json({ data: { result } });
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error", message: e?.message || String(e) });
  }
}

