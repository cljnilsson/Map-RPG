import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { unit } from "#lib/server/db/schema/unit.js";

/** Stat definitions used only when resolving army battles. */
export const battleStat = sqliteTable("battleStat", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").unique().notNull(),
	description: text("description").notNull(),
});

/** Per-unit values for battle stats; unrelated to character/player stats. */
export const battleUnitStats = sqliteTable(
	"battleUnitStats",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		unitId: integer("unit_id")
			.notNull()
			.references(() => unit.id),
		battleStatId: integer("battle_stat_id")
			.notNull()
			.references(() => battleStat.id),
		value: integer("value").notNull(),
	},
	(t) => [uniqueIndex("battleUnitStats_unitId_battleStatId_unique").on(t.unitId, t.battleStatId)],
);