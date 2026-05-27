import { sqliteTable, text, integer, check, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { characters } from "$lib/server/db/schema/character";

export const quests = sqliteTable(
	"quests",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		characterId: integer("character_id")
			.notNull()
			.references(() => characters.id),
		key: text("key").notNull(),
		progress: integer("progress").notNull(),
		status: text("status").$type<"active" | "completed" | "failed">().notNull(),
	},
	(t) => [uniqueIndex("unique_character_key").on(t.characterId, t.key), check("status_check", sql`status IN ('active', 'completed', 'failed')`)],
);