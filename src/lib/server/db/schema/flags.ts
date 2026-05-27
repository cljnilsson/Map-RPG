import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { user } from "$lib/server/db/schema/auth";
export const flags = sqliteTable("flags", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	name: text("name").notNull(),
	value: integer("value").notNull().default(0), // Use 0 for false, 1 for true
});

export type Flag = typeof flags.$inferSelect;