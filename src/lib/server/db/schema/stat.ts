import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const stat = sqliteTable("stat", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").unique().notNull(),
});

// RELATIONS
export type StatType = typeof stat.$inferSelect;