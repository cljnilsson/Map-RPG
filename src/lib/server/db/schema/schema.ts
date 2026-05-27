import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { characters } from "$lib/server/db/schema/character";
import { city } from "$lib/server/db/schema/city";
import { resource } from "$lib/server/db/schema/resource";
import { unit } from "$lib/server/db/schema/unit";

/*
	GAME
*/

export const plot = sqliteTable("plots", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	identifier: text("identifier").notNull(),
	cityId: integer("city_id")
		.notNull()
		.references(() => cityData.id),
	building: text("building"),
	level: integer("level").notNull().default(1),
});

// The city data is per character and reuses data from the 'base' city
export const cityData = sqliteTable("cityData", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	cityId: integer("city_id")
		.notNull()
		.references(() => city.id),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id),
	population: integer("population").notNull().default(1),
	workers: integer("workers").notNull().default(0),
});

export const windowPositions = sqliteTable("windowPositions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id),
	windowKey: text("windowKey").notNull(),
	x: integer("x").notNull(),
	y: integer("y").notNull(),
});

export const units = sqliteTable(
	"units",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		cityId: integer("city_id")
			.notNull()
			.references(() => cityData.id),
		unitId: integer("stat_id")
			.notNull()
			.references(() => unit.id),
		value: integer("value").notNull(),
	},
	(t) => [uniqueIndex("units_cityId_unitId_unique").on(t.cityId, t.unitId)],
);

export const resources = sqliteTable(
	"resources",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		cityId: integer("cityData_id")
			.notNull()
			.references(() => cityData.id),
		resourceId: integer("resource_id")
			.notNull()
			.references(() => resource.id),
		value: integer("value").notNull(),
		production: integer("production").notNull().default(0),
	},
	(t) => [uniqueIndex("resources_cityId_resourceId_unique").on(t.cityId, t.resourceId)],
);

export const loans = sqliteTable("loans", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	cityId: integer("cityData_id")
		.notNull()
		.references(() => cityData.id),
	resourceId: integer("resource_id")
		.notNull()
		.references(() => resource.id),
	paid: integer("paid").notNull(),
	full: integer("full").notNull(),
	timestamp: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const storage = sqliteTable("storage", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	cityId: integer("cityData_id")
		.notNull()
		.references(() => cityData.id),
	itemKey: text("item_key").notNull(),
	amount: integer("amount").notNull(),
});

// EXPORTS

export type Resource = typeof resources.$inferSelect;
export type CityData = typeof cityData.$inferSelect;
export type Plot = typeof plot.$inferInsert;