import { verifyToken } from "@clerk/backend";

export async function requireClerkUser(req) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return { userId: null, error: "Missing Authorization bearer token" };
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return { userId: null, error: "CLERK_SECRET_KEY is not set (backend env)" };
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    const userId = payload?.sub ? String(payload.sub) : null;
    if (!userId) return { userId: null, error: "Invalid token payload" };
    return { userId, error: null };
  } catch {
    return { userId: null, error: "Invalid or expired token" };
  }
}

