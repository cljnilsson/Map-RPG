import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { characters, stats, stat } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
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

async function insertCharacter(
	userId: string,
	name: string,
	age: number,
	str: number,
	dex: number,
	int: number,
	vit: number,
	charisma: number,
) {
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

export const getAllCharacters = query(get);
export const createCharacter = command(CreateCharacterSchema, create);