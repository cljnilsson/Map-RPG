import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	age: integer("age"),
	username: text("username").notNull().unique(),
	passwordHash: text("password_hash").notNull()
});

export const session = sqliteTable("session", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	token: text("token").notNull().unique(),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: integer("expires_at").notNull()
	//expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

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
	exp: integer("exp").notNull().default(0),
	health: integer("health").notNull().default(100),
	maxHealth: integer("maxHealth").notNull().default(100),
	class: text("class").notNull().default("Fighter"),
	faith: text("faith"), // Should be set to not null in the future when Faith is implemented
	race: text("race").notNull().default("Human"),
	gender: text("gender").notNull()
});

export const stat = sqliteTable("stat", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique()
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
		value: integer("value").notNull()
	},
	(stats) => ({
		// Prevents duplicate stats for the same character
		uniqueCharacterStat: unique().on(stats.characterId, stats.statId)
	})
);

// RELATIONS

export const userRelations = relations(user, ({ many }) => ({
	characters: many(characters)
}));

export const characterRelations = relations(characters, ({ one, many }) => ({
	stats: many(stats),
	user: one(user)
}));

export const statsRelations = relations(stats, ({ one }) => ({
	character: one(characters, { fields: [stats.characterId], references: [characters.id] }),
	stat: one(stat, {
		fields: [stats.statId],
		references: [stat.id]
	})
}));

// EXPORTS

export type Flag = typeof flags.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Character = typeof characters.$inferSelect;

export type Stat = typeof stats.$inferSelect;

export type StatType = typeof stat.$inferSelect;
