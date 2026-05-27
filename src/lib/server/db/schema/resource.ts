import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const resource = sqliteTable(
	"resource",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		iconPath: text("icon_path").notNull(),
		baseLimit: integer("base_limit").notNull().default(100),
	},
	(t) => [uniqueIndex("resource_name_unique").on(t.name), uniqueIndex("resource_iconPath_unique").on(t.iconPath)],
);

export type ResouceType = typeof resource.$inferSelect;