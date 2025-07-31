import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { stat, stats, characters, resource, city, cityData, unit, units } from "./src/lib/server/db/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("local.db");
const db = drizzle(sqlite);

// ----- Generic Helper Functions -----

async function recordExists<T>(table: any, column: any, value: T): Promise<boolean> {
	const exists = await db.select().from(table).where(eq(column, value)).get();
	return !!exists;
}

async function seedIfNotExists<T>(exists: boolean, seedFn: () => Promise<void>, label: string) {
	if (exists) {
		console.log(`${label} already seeded, skipping...`);
	} else {
		await seedFn();
		console.log(`✅ Seeded ${label}`);
	}
}

// ----- Seeding -----

async function seed() {
	await seedIfNotExists(
		await recordExists(stat, stat.name, "Strength"),
		async () => {
			await db
				.insert(stat)
				.values([
					{ name: "Strength" },
					{ name: "Dexterity" },
					{ name: "Vitality" },
					{ name: "Intelligence" },
					{ name: "Charisma" }
				]);
		},
		"stat table"
	);

	await seedIfNotExists(
		await recordExists(characters, characters.name, "Alice"),
		async () => {
			await db.insert(characters).values([
				{
					name: "Alice",
					age: 22,
					gender: "Female",
					race: "Human",
					class: "Wizard",
					level: 1,
					health: 10,
					maxHealth: 100,
					exp: 5,
					userId: 1 // Hardcoded for now
				}
			]);

			await db.insert(stats).values([
				{ value: 5, statId: 1, characterId: 1 },
				{ value: 5, statId: 2, characterId: 1 },
				{ value: 5, statId: 3, characterId: 1 },
				{ value: 5, statId: 4, characterId: 1 },
				{ value: 5, statId: 5, characterId: 1 }
			]);
			console.log("✅ Seeded stats table");
		},
		"character table"
	);

	await seedIfNotExists(
		await recordExists(resource, resource.name, "Wood"),
		async () => {
			await db
				.insert(resource)
				.values([{ name: "Wood" }, { name: "Gold" }, { name: "Iron" }, { name: "Stone" }, { name: "Silk" }, { name: "Wheat" }]);
		},
		"resource table"
	);

	await seedIfNotExists(
		await recordExists(city, city.name, "Winterfell"),
		async () => {
			await db.insert(city).values([{ name: "Winterfell" }]);

			await db.insert(cityData).values([{ workers: 5, population: 300, cityId: 1 }]);
			console.log("✅ Seeded city data table");
		},
		"city table"
	);

	await seedIfNotExists(
		await recordExists(unit, unit.name, "Priest"),
		async () => {
			await db.insert(unit).values([
				{ name: "Merchant", iconPath: "/items/mechant.jpg" },
				{ name: "Soldier", iconPath: "/items/soldier.jpg" },
				{ name: "Smith", iconPath: "/items/smith.jpg" },
				{ name: "Priest", iconPath: "/items/priest.jpg" }
			]);

			await db.insert(units).values([
				{ cityId: 1, unitId: 1, value: 1 },
				{ cityId: 1, unitId: 2, value: 2 },
				{ cityId: 1, unitId: 3, value: 3 },
				{ cityId: 1, unitId: 4, value: 4 }
			]);
			console.log("✅ Seeded unit data table");
		},
		"unit table"
	);
}

seed().catch(console.error);
