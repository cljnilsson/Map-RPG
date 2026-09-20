import { afterEach, beforeEach, expect, test } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "#lib/server/db/schema/index.js";
import { allocatePoints } from "#lib/server/skillPoints.js";

let sqlite: Database.Database;
let db: ReturnType<typeof drizzle<typeof schema>>;
const allocation = { str: 2, dex: 1, int: 0, vit: 0, char: 0 };

beforeEach(() => {
	sqlite = new Database(":memory:");
	db = drizzle(sqlite, { schema });
	sqlite.exec(`
		CREATE TABLE characters (id INTEGER PRIMARY KEY, user_id TEXT, unspent_skill_points INTEGER);
		CREATE TABLE stat (id INTEGER PRIMARY KEY, name TEXT);
		CREATE TABLE stats (id INTEGER PRIMARY KEY, character_id INTEGER, stat_id INTEGER, value INTEGER);
		INSERT INTO characters VALUES (1, 'owner', 3);
		INSERT INTO stat VALUES (1, 'Strength'), (2, 'Dexterity'), (3, 'Intelligence'), (4, 'Vitality'), (5, 'Charisma');
		INSERT INTO stats VALUES (1, 1, 1, 6), (2, 1, 2, 6), (3, 1, 3, 6), (4, 1, 4, 6), (5, 1, 5, 6);
	`);
});
afterEach(() => sqlite.close());

test("persists increases and deducts the balance together", () => {
	expect(allocatePoints(db, "owner", 1, allocation)).toEqual({
		stats: { str: 8, dex: 7, int: 6, vit: 6, char: 6 },
		unspentSkillPoints: 0,
	});
	expect(sqlite.prepare("SELECT value FROM stats WHERE id = 1").get()).toEqual({ value: 8 });
	expect(() => allocatePoints(db, "owner", 1, allocation)).toThrow("Not enough");
});

test("allows spending only part of the balance", () => {
	expect(allocatePoints(db, "owner", 1, { ...allocation, str: 0 }).unspentSkillPoints).toBe(2);
});

test("rejects other users and missing characters", () => {
	expect(() => allocatePoints(db, "other", 1, allocation)).toThrow("Character not found");
	expect(() => allocatePoints(db, "owner", 2, allocation)).toThrow("Character not found");
});

test.each([-1, 0.5, Number.NaN, Number.POSITIVE_INFINITY])("rejects invalid increments: %s", (str) => {
	expect(() => allocatePoints(db, "owner", 1, { ...allocation, str })).toThrow();
});

test("rejects overspending and empty allocations", () => {
	expect(() => allocatePoints(db, "owner", 1, { ...allocation, str: 3 })).toThrow("Not enough");
	expect(() => allocatePoints(db, "owner", 1, { str: 0, dex: 0, int: 0, vit: 0, char: 0 })).toThrow();
});

test("rolls back earlier stat updates if a required stat is missing", () => {
	sqlite.exec("DELETE FROM stats WHERE id = 5");
	expect(() => allocatePoints(db, "owner", 1, allocation)).toThrow("Missing character stat");
	expect(sqlite.prepare("SELECT value FROM stats WHERE id = 1").get()).toEqual({ value: 6 });
	expect(sqlite.prepare("SELECT unspent_skill_points FROM characters WHERE id = 1").get()).toEqual({ unspent_skill_points: 3 });
});