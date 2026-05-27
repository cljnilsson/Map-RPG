import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const city = sqliteTable("city", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
});