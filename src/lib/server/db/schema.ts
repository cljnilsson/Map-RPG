import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

export type Flag = typeof flags.$inferSelect;

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
