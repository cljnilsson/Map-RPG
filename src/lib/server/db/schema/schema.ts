import { sqliteTable, text, integer, check, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { user } from "$lib/server/db/schema/auth";
import { characters, items, stats } from "$lib/server/db/schema/character";
import { city } from "$lib/server/db/schema/city";
import { resource } from "$lib/server/db/schema/resource";

/*
	GAME
*/

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

export const unit = sqliteTable("unit", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	iconPath: text("icon_path").notNull(),
	name: text("name").unique().notNull(),
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

// RELATIONS

export const characterRelations = relations(characters, ({ one, many }) => ({
	stats: many(stats),
	user: one(user, {
		fields: [characters.userId],
		references: [user.id],
	}),
	inventory: many(items),
	windowPositions: many(windowPositions),
	cities: many(cityData),
}));

export const cityDataRelations = relations(cityData, ({ many, one }) => ({
	resources: many(resources),
	city: one(city, { fields: [cityData.cityId], references: [city.id] }),
	storage: many(storage),
	units: many(units),
	plots: many(plot),
	loans: many(loans),
	character: one(characters, {
		fields: [cityData.characterId],
		references: [characters.id],
	}),
}));

export const plotRelations = relations(plot, ({ one }) => ({
	city: one(cityData, { fields: [plot.cityId], references: [cityData.id] }),
}));

export const storageRelations = relations(storage, ({ one }) => ({
	city: one(cityData, { fields: [storage.cityId], references: [cityData.id] }),
}));

export const unitsRelations = relations(units, ({ one }) => ({
	city: one(cityData, { fields: [units.cityId], references: [cityData.id] }),
	unit: one(unit, { fields: [units.unitId], references: [unit.id] }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
	city: one(cityData, {
		fields: [resources.cityId],
		references: [cityData.id],
	}),
	resource: one(resource, {
		fields: [resources.resourceId],
		references: [resource.id],
	}),
}));

export const loanRelations = relations(loans, ({ one }) => ({
	city: one(cityData, { fields: [loans.cityId], references: [cityData.id] }),
	resource: one(resource, {
		fields: [loans.resourceId],
		references: [resource.id],
	}),
}));

export const windowPositionRelations = relations(windowPositions, ({ one }) => ({
	character: one(characters, {
		fields: [windowPositions.characterId],
		references: [characters.id],
	}),
}));

// EXPORTS

export type Resource = typeof resources.$inferSelect;
export type CityData = typeof cityData.$inferSelect;
export type Plot = typeof plot.$inferInsert;
export type Settings = typeof settings.$inferSelect;