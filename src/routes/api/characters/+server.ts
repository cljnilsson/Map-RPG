import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters, stats, stat } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

async function getCharacters(userId: number) {
	return await db.query.characters.findMany({
		where: eq(characters.userId, userId),
		with: {
			stats: {
				with: {
					stat: true
				}
			}
		}
	});
}

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userId = locals.user.id;
	const existing = await getCharacters(userId);

	const adjusted = existing.map((char) => ({
		...char,
		stats: char.stats.map((s) => ({
			name: s.stat.name,
			value: s.value
		}))
	}));

	return json({ success: true, characters: adjusted });
};

function isValidInput(name: unknown, age: unknown, str: unknown, dex: unknown, int: unknown, vit: unknown, charisma: unknown): boolean {
	return (
		typeof name === "string" &&
		typeof age === "number" &&
		typeof str === "number" &&
		typeof dex === "number" &&
		typeof int === "number" &&
		typeof vit === "number" &&
		typeof charisma === "number"
	);
}

async function insertCharacter(
	userId: number,
	name: string,
	age: number,
	str: number,
	dex: number,
	int: number,
	vit: number,
	charisma: number
) {
	const [character] = await db
		.insert(characters)
		.values({
			userId,
			name,
			age,
			race: "Unknown",
			gender: "Unknown"
		})
		.returning({ id: characters.id });

	async function getStat(name: string) {
		return await db.query.stat.findFirst({
			where: eq(stat.name, name),
			columns: { id: true }
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
		{ characterId: character.id, statId: chaStat.id, value: charisma }
	]);
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { name, age, stats } = await request.json();
	console.log(name, age, stats);

	if (!isValidInput(name, age, stats.str, stats.dex, stats.int, stats.vit, stats.charisma)) {
		return new Response("Invalid input", { status: 400 });
	}

	const userId = locals.user.id;

	await insertCharacter(userId, name, age, stats.str, stats.dex, stats.int, stats.vit, stats.charisma);

	return json({ success: true });
};
