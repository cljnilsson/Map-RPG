import { sqliteTable, text, integer, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "$lib/server/db/schema/auth";
export const settings = sqliteTable(
	"settings",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id),
		darkMode: integer({ mode: "boolean" }).notNull().default(false),
		offlineMode: integer({ mode: "boolean" }).notNull().default(false),
		keybindTooltips: integer({ mode: "boolean" }).notNull().default(false),
		keybinds: text("keybinds", { mode: "json" }).notNull().default("{}").$type<Record<string, string>>(),
	},
	(table) => [
		// enforce min/max length on the JSON string
		check("keybinds_length", sql`length(${table.keybinds}) BETWEEN 1 AND 150`),

		// enforce that the value is valid JSON
		check("keybinds_valid", sql`json_valid(${table.keybinds}) = 1`),
	],
);

export type Settings = typeof settings.$inferSelect;