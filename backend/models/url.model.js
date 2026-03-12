import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const urlTable = pgTable("realurl_urls", {
  id: uuid("id").primaryKey().defaultRandom(),
  shortCode: varchar("code", { length: 64 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),
  ownerId: text("owner_id").notNull(), // Clerk userId (string)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

