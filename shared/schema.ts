import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  progress: jsonb("progress").$type<{
    network: number,
    os: number,
    owasp: number
  }>(),
  completedTutorials: text("completed_tutorials").array(),
});

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // "network", "os", "owasp"
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

export const vulnerabilityPayloads = pgTable("vulnerability_payloads", {
  id: serial("id").primaryKey(),
  vulnerability: text("vulnerability").notNull(), // e.g., "sql_injection", "xss"
  payload: text("payload").notNull(),
  description: text("description").notNull(),
  isSuccessful: boolean("is_successful").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  progress: true,
  completedTutorials: true,
});

export const insertTutorialSchema = createInsertSchema(tutorials);

export const insertVulnerabilityPayloadSchema = createInsertSchema(vulnerabilityPayloads);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorials.$inferSelect;

export type InsertVulnerabilityPayload = z.infer<typeof insertVulnerabilityPayloadSchema>;
export type VulnerabilityPayload = typeof vulnerabilityPayloads.$inferSelect;
