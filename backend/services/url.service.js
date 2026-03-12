import { and, desc, eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { urlTable } from "../models/url.model.js";

export async function createUrl({ targetUrl, shortCode, ownerId }) {
  const [row] = await db
    .insert(urlTable)
    .values({ targetUrl, shortCode, ownerId })
    .returning({
      id: urlTable.id,
      shortCode: urlTable.shortCode,
      targetUrl: urlTable.targetUrl,
      createdAt: urlTable.createdAt,
      updatedAt: urlTable.updatedAt,
    });
  return row;
}

export async function listUrlsByOwner(ownerId) {
  return await db
    .select({
      id: urlTable.id,
      shortCode: urlTable.shortCode,
      targetUrl: urlTable.targetUrl,
      createdAt: urlTable.createdAt,
      updatedAt: urlTable.updatedAt,
    })
    .from(urlTable)
    .where(eq(urlTable.ownerId, ownerId))
    .orderBy(desc(urlTable.createdAt));
}

export async function deleteUrlByIdForOwner({ id, ownerId }) {
  const [row] = await db
    .delete(urlTable)
    .where(and(eq(urlTable.id, id), eq(urlTable.ownerId, ownerId)))
    .returning({ shortCode: urlTable.shortCode, targetUrl: urlTable.targetUrl });
  return row ?? null;
}

export async function getTargetByShortCode(shortCode) {
  const [row] = await db
    .select({ targetUrl: urlTable.targetUrl })
    .from(urlTable)
    .where(eq(urlTable.shortCode, shortCode));
  return row ?? null;
}

