import { requireClerkUser } from "../middleware/clerkAuth.js";
import { deleteUrlByIdForOwner } from "../services/url.service.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const { userId, error } = await requireClerkUser(req);
  if (error) return res.status(401).json({ error });

  const { id } = req.query;

  try {
    const deleted = await deleteUrlByIdForOwner({ id, ownerId: userId });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ data: { result: deleted } });
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error", message: e?.message || String(e) });
  }
}

