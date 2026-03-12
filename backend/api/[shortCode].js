import { getTargetByShortCode } from "../services/url.service.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { shortCode } = req.query;
  if (shortCode === "favicon.ico") return res.status(204).end();

  try {
    const row = await getTargetByShortCode(shortCode);
    if (!row) return res.status(404).json({ error: "URL not found" });
    return res.redirect(301, row.targetUrl);
  } catch {
    return res.status(500).json({ error: "Failed to resolve short URL" });
  }
}

