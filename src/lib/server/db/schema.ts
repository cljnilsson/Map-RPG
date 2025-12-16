import { sqliteTable, text, integer, uniqueIndex, check } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

/*
	AUTH
*/
export const user = sqliteTable(
	"user",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		age: integer("age"),
		username: text("username").unique().notNull(),
		passwordHash: text("password_hash").notNull()
	}
);

export const session = sqliteTable(
	"session",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		token: text("token").unique().notNull(),
		userId: integer("user_id")
			.notNull()
			.references(() => user.id),
		expiresAt: integer("expires_at").notNull()
	}
);

/*
	GAME
*/

export const flags = sqliteTable("flags", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	name: text("name").notNull(),
	value: integer("value").notNull().default(0) // Use 0 for false, 1 for true
});

export const characters = sqliteTable("characters", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	name: text("name").notNull(),
	age: integer("age").notNull().default(18),
	level: integer("level").notNull().default(1),
	xp: integer("exp").notNull().default(0),
	health: integer("health").notNull().default(100),
	maxHealth: integer("maxHealth").notNull().default(100),
	gold: integer("gold").notNull().default(0),
	silver: integer("silver").notNull().default(0),
	copper: integer("copper").notNull().default(0),
	class: text("class").notNull().default("Fighter"),
	faith: text("faith"), // Should be set to not null in the future when Faith is implemented
	race: text("race").notNull().default("Human"),
	gender: text("gender").notNull()
});

export const items = sqliteTable("items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id),
	itemKey: text("itemKey").notNull(),
	amount: integer("amount").notNull().default(1)
});

export const settings = sqliteTable(
	"settings",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => user.id),
		darkMode: integer({ mode: "boolean" }).notNull().default(false),
		offlineMode: integer({ mode: "boolean" }).notNull().default(false),
		keybindTooltips: integer({ mode: "boolean" }).notNull().default(false),
		keybinds: text("keybinds", {mode: "json"}).notNull().default("{}").$type<Record<string, string>>()
	},
	(table) => [
		// enforce min/max length on the JSON string
		check("keybinds_length", sql`length(${table.keybinds}) BETWEEN 1 AND 150`),

		// enforce that the value is valid JSON
		check("keybinds_valid", sql`json_valid(${table.keybinds}) = 1`)
	]
);

export const city = sqliteTable("city", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull()
});

export const plot = sqliteTable("plots", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	identifier: text("identifier").notNull(),
	cityId: integer("city_id")
		.notNull()
		.references(() => cityData.id),
	building: text("building"),
	level: integer("level").notNull().default(1)
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
	workers: integer("workers").notNull().default(0)
});

export const windowPositions = sqliteTable("windowPositions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id),
	windowKey: text("windowKey").notNull(),
	x: integer("x").notNull(),
	y: integer("y").notNull()
});

export const stat = sqliteTable(
	"stat",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").unique().notNull()
	}
);

export const stats = sqliteTable(
	"stats",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		characterId: integer("character_id")
			.notNull()
			.references(() => characters.id),
		statId: integer("stat_id")
			.notNull()
			.references(() => stat.id),
		value: integer("value").notNull()
	},
	(t) => [uniqueIndex("stats_characterId_statId_unique").on(t.characterId, t.statId)]
);

export const quests = sqliteTable(
	"quests",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		characterId: integer("character_id")
			.notNull()
			.references(() => characters.id),
		key: text("key").notNull(),
		progress: integer("progress").notNull(),
		status: text("status").$type<"active" | "completed" | "failed">().notNull()
	},
	(t) => [
		uniqueIndex("unique_character_key").on(t.characterId, t.key),
		check("status_check", sql`status IN ('active', 'completed', 'failed')`)
	]
);

export const unit = sqliteTable(
	"unit",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		iconPath: text("icon_path").notNull(),
		name: text("name").unique().notNull()
	}
);

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
		value: integer("value").notNull()
	},
	(t) => [uniqueIndex("units_cityId_unitId_unique").on(t.cityId, t.unitId)]
);

export const resource = sqliteTable(
	"resource",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		iconPath: text("icon_path").notNull(),
		baseLimit: integer("base_limit").notNull().default(100)
	},
	(t) => [uniqueIndex("resource_name_unique").on(t.name), uniqueIndex("resource_iconPath_unique").on(t.iconPath)]
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
		value: integer("value").notNull()
	},
	(t) => [uniqueIndex("resources_cityId_resourceId_unique").on(t.cityId, t.resourceId)]
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
	timestamp: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
});

export const storage = sqliteTable("storage", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	cityId: integer("cityData_id")
		.notNull()
		.references(() => cityData.id),
	itemKey: text("item_key").notNull(),
	amount: integer("amount").notNull()
});

// RELATIONS

export const userRelations = relations(user, ({ many }) => ({
	characters: many(characters)
}));

export const cityDataRelations = relations(cityData, ({ many, one }) => ({
	resources: many(resources),
	city: one(city, { fields: [cityData.cityId], references: [city.id] }),
	storage: many(storage),
	units: many(units),
	plots: many(plot),
	loans: many(loans),
	character: one(characters, { fields: [cityData.characterId], references: [characters.id]})
}));

export const plotRelations = relations(plot, ({ one }) => ({
	city: one(cityData, { fields: [plot.cityId], references: [cityData.id] })
}));

export const storageRelations = relations(storage, ({ one }) => ({
	city: one(cityData, { fields: [storage.cityId], references: [cityData.id] })
}));

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

export const statsRelations = relations(stats, ({ one }) => ({
	character: one(characters, { fields: [stats.characterId], references: [characters.id] }),
	stat: one(stat, { fields: [stats.statId], references: [stat.id] })
}));

export const unitsRelations = relations(units, ({ one }) => ({
	city: one(cityData, { fields: [units.cityId], references: [cityData.id] }),
	unit: one(unit, { fields: [units.unitId], references: [unit.id] })
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
	city: one(cityData, { fields: [resources.cityId], references: [cityData.id] }),
	resource: one(resource, { fields: [resources.resourceId], references: [resource.id] })
}));

export const loanRelations = relations(loans, ({ one }) => ({
	city: one(cityData, { fields: [loans.cityId], references: [cityData.id] }),
	resource: one(resource, { fields: [loans.resourceId], references: [resource.id] })
}));

export const itemRelations = relations(items, ({ one }) => ({
	character: one(characters, { fields: [items.characterId], references: [characters.id] })
}));

export const windowPositionRelations = relations(windowPositions, ({ one }) => ({
	character: one(characters, { fields: [windowPositions.characterId], references: [characters.id] })
}));

// EXPORTS

export type Flag = typeof flags.$inferSelect;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type StatType = typeof stat.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type ResouceType = typeof resource.$inferSelect;
export type City = typeof city.$inferSelect;
export type CityData = typeof cityData.$inferSelect;
export type Plot = typeof plot.$inferInsert;
export type Settings = typeof settings.$inferSelect;
