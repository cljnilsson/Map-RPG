import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { stat } from "#lib/server/db/schema/stat.js";

export const unit = sqliteTable("unit", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	iconPath: text("icon_path").notNull(),
	name: text("name").unique().notNull(),
});

export const unitStats = sqliteTable(
	"unitStats",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		unitId: integer("unit_id")
			.notNull()
			.references(() => unit.id),
		statId: integer("stat_id")
			.notNull()
			.references(() => stat.id),
		value: integer("value").notNull(),
	},
	(t) => [uniqueIndex("stats_unitId_statId_unique").on(t.unitId, t.statId)],
);