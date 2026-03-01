import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
	stat,
	stats,
	characters,
	resource,
	resources,
	city,
	cityData,
	unit,
	units,
	user,
	type User,
} from "./src/lib/server/db/schema";
import { eq } from "drizzle-orm";

const sqlite = new Database("local.db"); // path to your SQLite file
const db = drizzle(sqlite);

// Notably it does not reset the DB before seeding
async function StatExists(name: string): Promise<boolean> {
	const exists = await db.select().from(stat).where(eq(stat.name, name)).get();

	return !!exists;
}

async function ResourceExists(name: string): Promise<boolean> {
	const exists = await db.select().from(resource).where(eq(resource.name, name)).get();

	return !!exists;
}

async function CharacterExists(name: string): Promise<boolean> {
	const exists = await db.select().from(characters).where(eq(characters.name, name)).get();

	return !!exists;
}

async function CityExists(name: string): Promise<boolean> {
	const exists = await db.select().from(city).where(eq(city.name, name)).get();

	return !!exists;
}

async function UnitExists(name: string): Promise<boolean> {
	const exists = await db.select().from(unit).where(eq(unit.name, name)).get();

	return !!exists;
}

async function getFirstUserIfExists(): Promise<User | null> {
	const exists = await db.select().from(user);

	return exists.length > 0 ? exists[0] : null;
}

async function seed() {
	if (await StatExists("Strength")) {
		console.log("Stat table already seeded, skipping...");
	} else {
		await db
			.insert(stat)
			.values([
				{ name: "Strength" },
				{ name: "Dexterity" },
				{ name: "Vitality" },
				{ name: "Intelligence" },
				{ name: "Charisma" },
			]);

		console.log("✅ Seeded stat table");
	}

	const user = await getFirstUserIfExists();
	if (!user) {
		console.error("Cannot seed further because a user to link it to does not exist!");
		return;
	}

	if (await CharacterExists("Alice")) {
		console.log("Character table already seeded, skipping...");
	} else {
		await db.insert(characters).values([
			{
				name: "Alice",
				age: 22,
				gender: "Female",
				race: "Human",
				class: "Wizard",
				imagePath: "/char.jpg",
				level: 1,
				health: 10,
				maxHealth: 100,
				xp: 5,
				userId: user.id,
			}, // Hardcoded userId for now
		]);

		console.log("✅ Seeded character table");

		await db.insert(stats).values([
			{ value: 5, statId: 1, characterId: 1 }, // Hardcoded characterId for now
			{ value: 5, statId: 2, characterId: 1 }, // Hardcoded characterId for now
			{ value: 5, statId: 3, characterId: 1 }, // Hardcoded characterId for now
			{ value: 5, statId: 4, characterId: 1 }, // Hardcoded characterId for now
			{ value: 5, statId: 5, characterId: 1 }, // Hardcoded characterId for now
		]);

		console.log("✅ Seeded stats table");
	}

	if (await ResourceExists("Wood")) {
		console.log("Resource table already seeded, skipping...");
	} else {
		await db.insert(resource).values([
			{ name: "Wood", iconPath: "/items/wood.jpg" },
			{ name: "Gold", iconPath: "/items/coin3.jpg" },
			{ name: "Iron", iconPath: "/items/ore1.png" },
			{ name: "Stone", iconPath: "/items/stone0.jpg" },
			{ name: "Silk", iconPath: "/items/silk.png" },
			{ name: "Wheat", iconPath: "/items/wheat.jpg" },
		]);

		console.log("✅ Seeded resource table");
	}

	if (await CityExists("Winterfell")) {
		console.log("City table already seeded, skipping...");
	} else {
		await db.insert(city).values([{ name: "Winterfell" }]);

		console.log("✅ Seeded city table");

		await db.insert(cityData).values([
			{ workers: 5, population: 300, cityId: 1, characterId: 1 }, // Hardcoded cityId and Character for now
		]);

		console.log("✅ Seeded city data table");
	}

	if (await UnitExists("Priest")) {
		console.log("Unit table already seeded, skipping...");
	} else {
		await db.insert(unit).values([
			{ name: "Merchant", iconPath: "/units/merchant.jpg" },
			{ name: "Soldier", iconPath: "/units/soldier.jpg" },
			{ name: "Smith", iconPath: "/units/smith.jpg" },
			{ name: "Priest", iconPath: "/units/priest.jpg" },
		]);

		console.log("✅ Seeded unit table");

		await db.insert(units).values([
			{ cityId: 1, unitId: 1, value: 1 },
			{ cityId: 1, unitId: 2, value: 2 },
			{ cityId: 1, unitId: 3, value: 3 },
			{ cityId: 1, unitId: 4, value: 4 },
		]);

		console.log("✅ Seeded unit data table");

		await db.insert(resources).values([
			{ cityId: 1, resourceId: 1, value: 1, production: 1 },
			{ cityId: 1, resourceId: 2, value: 1, production: 1 },
			{ cityId: 1, resourceId: 3, value: 1, production: 1 },
			{ cityId: 1, resourceId: 4, value: 1, production: 1 },
			{ cityId: 1, resourceId: 5, value: 1, production: 1 },
			{ cityId: 1, resourceId: 6, value: 1, production: 1 },
		]);

		console.log("✅ Seeded resource data table");
	}
}

seed().catch((err) => {
	console.error(err);
});