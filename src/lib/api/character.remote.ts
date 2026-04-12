import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { characters, stats, stat, items } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

async function getCharacters(userId: string) {
	return await db.query.characters.findMany({
		where: eq(characters.userId, userId),
		with: {
			stats: {
				with: {
					stat: true,
				},
			},
			inventory: true,
		},
	});
}

async function get() {
	// In theory should block requests if user is not logged in
	const user = await getUser();

	const userId = user.id;
	const existing = await getCharacters(userId);

	const adjusted = existing.map((char) => ({
		...char,
		stats: char.stats.map((s) => ({
			name: s.stat.name,
			value: s.value,
		})),
	}));

	return { success: true, characters: adjusted };
}

const CreateCharacterSchema = v.object({
	name: v.string(),
	age: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	stats: v.object({
		str: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
		dex: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
		int: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
		vit: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
		charisma: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	}),
});

type CreateCharacterData = v.InferOutput<typeof CreateCharacterSchema>;

const CharacterStatsSchema = v.object({
	str: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	dex: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	int: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	vit: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	char: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
});

const InventoryItemSchema = v.object({
	// use a pipeline: first ensure it's a string, then require min length 1
	name: v.pipe(v.string(), v.minLength(1)),
	amount: v.number(),
});

const SaveCharacterSchema = v.object({
	oldName: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
	stats: CharacterStatsSchema,
	xp: v.number(),
	health: v.number(),
	maxHealth: v.number(),
	level: v.number(),
	inventory: v.array(InventoryItemSchema),
});

type SaveCharacterData = v.InferOutput<typeof SaveCharacterSchema>;

async function insertCharacter(userId: string, name: string, age: number, str: number, dex: number, int: number, vit: number, charisma: number) {
	const [character] = await db
		.insert(characters)
		.values({
			userId,
			name,
			age,
			race: "Unknown",
			gender: "Unknown",
			maxHealth: 10 + (str + dex) / 2,
			health: 10 + (str + dex) / 2,
			level: 1,
			xp: 0,
			copper: 0,
			silver: 0,
			gold: 0,
		})
		.returning({ id: characters.id });

	async function getStat(name: string) {
		return await db.query.stat.findFirst({
			where: eq(stat.name, name),
			columns: { id: true },
		});
	}

	const strStat = await getStat("Strength");
	const dexStat = await getStat("Dexterity");
	const intStat = await getStat("Intelligence");
	const vitStat = await getStat("Vitality");
	const chaStat = await getStat("Charisma");

	if (!strStat || !dexStat || !intStat || !vitStat || !chaStat) {
		throw new Error("Mandatory stat does not exist in database");
	}

	await db.insert(stats).values([
		{ characterId: character.id, statId: strStat.id, value: str },
		{ characterId: character.id, statId: dexStat.id, value: dex },
		{ characterId: character.id, statId: intStat.id, value: int },
		{ characterId: character.id, statId: vitStat.id, value: vit },
		{ characterId: character.id, statId: chaStat.id, value: charisma },
	]);
}

async function create({ name, age, stats }: CreateCharacterData): Promise<boolean> {
	// In theory should block requests if user is not logged in
	const user = await getUser();

	console.log(name, age, stats);

	const userId = user.id;

	await insertCharacter(userId, name, age, stats.str, stats.dex, stats.int, stats.vit, stats.charisma);

	return true;
}

async function updateCharacter(
	userId: string,
	oldName: string,
	name: string,
	str: number,
	dex: number,
	int: number,
	vit: number,
	charisma: number,
	xp: number,
	health: number,
	maxHealth: number,
	level: number,
	inventory: { name: string; amount: number }[],
): Promise<boolean> {
	await db
		.update(characters)
		.set({ name, xp, health, maxHealth, level })
		.where(and(eq(characters.userId, userId), eq(characters.name, oldName)));

	const character = await db.query.characters.findFirst({
		where: and(eq(characters.userId, userId), eq(characters.name, name)),
		columns: { id: true },
	});

	if (!character) {
		throw new Error("Character not found after update");
	}

	async function getStatId(name: string) {
		const statEntry = await db.query.stat.findFirst({
			where: eq(stat.name, name),
			columns: { id: true },
		});
		if (!statEntry) throw new Error(`Stat ${name} does not exist in database`);
		return statEntry.id;
	}

	const [strId, dexId, intId, vitId, chaId] = await Promise.all([
		getStatId("Strength"),
		getStatId("Dexterity"),
		getStatId("Intelligence"),
		getStatId("Vitality"),
		getStatId("Charisma"),
	]);

	await Promise.all([
		db
			.update(stats)
			.set({ value: str })
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, strId))),
		db
			.update(stats)
			.set({ value: dex })
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, dexId))),
		db
			.update(stats)
			.set({ value: int })
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, intId))),
		db
			.update(stats)
			.set({ value: vit })
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, vitId))),
		db
			.update(stats)
			.set({ value: charisma })
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, chaId))),
	]);

	await db.delete(items).where(eq(items.characterId, character.id));
	await db.insert(items).values([
		...inventory.map((item) => ({
			characterId: character.id,
			itemKey: item.name,
			amount: item.amount || 1,
		})),
	]);

	return true;
}

async function save({ oldName, name, stats, xp, health, maxHealth, level, inventory }: SaveCharacterData) {
	// In theory should block requests if user is not logged in
	const user = await getUser();

	const userId = user.id;

	const success = await updateCharacter(
		userId,
		oldName,
		name,
		stats.str,
		stats.dex,
		stats.int,
		stats.vit,
		stats.char,
		xp,
		health,
		maxHealth,
		level,
		inventory,
	);

	return success;
}

export const getAllCharacters = query(get);
export const createCharacter = command(CreateCharacterSchema, create);
export const saveCharacter = command(SaveCharacterSchema, save);