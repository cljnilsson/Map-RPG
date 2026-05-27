import { sqliteTable, text, integer, index, check, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { classValues } from "$lib/types/class";
import { user, session, account } from "$lib/server/db/schema/auth";
import { stat } from "$lib/server/db/schema/stat";

const genderValues = ["Male", "Female", "Unknown"] as const;

export const characters = sqliteTable("characters", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	name: text("name").notNull(),
	age: integer("age").notNull().default(18),
	level: integer("level").notNull().default(1),
	xp: integer("exp").notNull().default(0),
	health: integer("health").notNull().default(100),
	maxHealth: integer("maxHealth").notNull().default(100),
	imagePath: text("image").notNull().default(""),
	gold: integer("gold").notNull().default(0),
	silver: integer("silver").notNull().default(0),
	copper: integer("copper").notNull().default(0),
	class: text("class", { enum: classValues }).notNull().default("Fighter"),
	faith: text("faith").notNull().default(""),
	race: text("race").notNull().default("Human"),
	gender: text("gender", { enum: genderValues }).notNull(),
});

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
		value: integer("value").notNull(),
	},
	(t) => [uniqueIndex("stats_characterId_statId_unique").on(t.characterId, t.statId)],
);

export const items = sqliteTable("items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	characterId: integer("character_id")
		.notNull()
		.references(() => characters.id),
	itemKey: text("itemKey").notNull(),
	amount: integer("amount").notNull().default(1),
});

// RELATIONS
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	characters: many(characters),
}));

export const itemRelations = relations(items, ({ one }) => ({
	character: one(characters, {
		fields: [items.characterId],
		references: [characters.id],
	}),
}));

export const statsRelations = relations(stats, ({ one }) => ({
	character: one(characters, {
		fields: [stats.characterId],
		references: [characters.id],
	}),
	stat: one(stat, { fields: [stats.statId], references: [stat.id] }),
}));

export type Character = typeof characters.$inferSelect;
export type Stat = typeof stats.$inferSelect;