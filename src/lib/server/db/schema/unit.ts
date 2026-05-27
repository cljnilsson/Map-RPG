import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const unit = sqliteTable("unit", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	iconPath: text("icon_path").notNull(),
	name: text("name").unique().notNull(),
});