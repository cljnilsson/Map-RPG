import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { stat, stats, characters } from "./src/lib/server/db/schema";

const sqlite = new Database("local.db"); // path to your SQLite file
const db = drizzle(sqlite);

// Notably it does not reset the DB before seeding

async function seed() {
	await db
		.insert(stat)
		.values([
			{ name: "Strength" },
			{ name: "Dexterity" },
			{ name: "Vitality" },
			{ name: "Intelligence" },
			{ name: "Charisma" }
		]);

	console.log("✅ Seeded stat table");

	await db.insert(characters).values([
		{ name: "Alice", age: 22, gender: "Female", race: "Human", userId: 2 } // Hardcoded userId for now
	]);

	console.log("✅ Seeded character table");

	await db.insert(stats).values([
		{ value: 5, statId: 1, characterId: 1 }, // Hardcoded characterId for now
		{ value: 5, statId: 2, characterId: 1 }, // Hardcoded characterId for now
		{ value: 5, statId: 3, characterId: 1 }, // Hardcoded characterId for now
		{ value: 5, statId: 4, characterId: 1 }, // Hardcoded characterId for now
		{ value: 5, statId: 5, characterId: 1 } // Hardcoded characterId for now
	]);

	console.log("✅ Seeded stats table");
}

seed().catch((err) => {
	console.error(err);
});
