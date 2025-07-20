import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters, stats, stat } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

async function updateCharacter(
	userId: number,
	oldName: string,
	name: string,
	str: number,
	dex: number,
	int: number,
	vit: number,
	charisma: number,
	exp: number,
	health: number,
	maxHealth: number,
	level: number
): Promise<boolean> {
	await db
		.update(characters)
		.set({ name, exp, health, maxHealth, level })
		.where(and(eq(characters.userId, userId), eq(characters.name, oldName)));

	const character = await db.query.characters.findFirst({
		where: and(eq(characters.userId, userId), eq(characters.name, name)),
		columns: { id: true }
	});

	if (!character) {
		throw new Error("Character not found after update");
	}

	async function getStatId(name: string) {
		const statEntry = await db.query.stat.findFirst({
			where: eq(stat.name, name),
			columns: { id: true }
		});
		if (!statEntry) throw new Error(`Stat ${name} does not exist in database`);
		return statEntry.id;
	}

	const [strId, dexId, intId, vitId, chaId] = await Promise.all([
		getStatId("Strength"),
		getStatId("Dexterity"),
		getStatId("Intelligence"),
		getStatId("Vitality"),
		getStatId("Charisma")
	]);

	await Promise.all([
		db.update(stats).set({ value: str }).where(and(eq(stats.characterId, character.id), eq(stats.statId, strId))),
		db.update(stats).set({ value: dex }).where(and(eq(stats.characterId, character.id), eq(stats.statId, dexId))),
		db.update(stats).set({ value: int }).where(and(eq(stats.characterId, character.id), eq(stats.statId, intId))),
		db.update(stats).set({ value: vit }).where(and(eq(stats.characterId, character.id), eq(stats.statId, vitId))),
		db.update(stats).set({ value: charisma }).where(and(eq(stats.characterId, character.id), eq(stats.statId, chaId))),
	]);

	return true;
}

function isValidInput(
	oldName: unknown,
	name: unknown,
	str: unknown,
	dex: unknown,
	int: unknown,
	vit: unknown,
	charisma: unknown,
	exp: unknown,
	health: unknown,
	maxHealth: unknown,
	level: unknown
): boolean {
	return (
		typeof oldName === "string" &&
		typeof name === "string" &&
		typeof str === "number" &&
		typeof dex === "number" &&
		typeof int === "number" &&
		typeof vit === "number" &&
		typeof charisma === "number" &&
		typeof exp === "number" &&
		typeof health === "number" &&
		typeof maxHealth === "number" &&
		typeof level === "number"
	);
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { oldName, name, stats, exp, health, maxHealth, level } = await request.json();
	console.log(name, stats, exp, health, maxHealth, level);

	if (!isValidInput(oldName, name, stats.str, stats.dex, stats.int, stats.vit, stats.charisma, exp, health, maxHealth, level)) {
		return new Response("Invalid input", { status: 400 });
	}

	const userId = locals.user.id;

	const success = await updateCharacter(
		userId,
		oldName,
		name,
		stats.str,
		stats.dex,
		stats.int,
		stats.vit,
		stats.charisma,
		exp,
		health,
		maxHealth,
		level
	);

	return json({ success: success });
};
