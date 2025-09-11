import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters, stats, stat, items } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

type CharacterStats = {
	str: number;
	dex: number;
	int: number;
	vit: number;
	char: number;
};

type InventoryItem = {
	name: string;
	amount: number;
};

type UpdateCharacterPayload = {
	oldName: string;
	name: string;
	stats: CharacterStats;
	exp: number;
	health: number;
	maxHealth: number;
	level: number;
	inventory: InventoryItem[];
};

async function updateCharacter(
	userId: number,
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
	inventory: { name: string; amount: number }[]
): Promise<boolean> {
	await db
		.update(characters)
		.set({ name, xp, health, maxHealth, level })
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
			.where(and(eq(stats.characterId, character.id), eq(stats.statId, chaId)))
	]);

	await db.delete(items).where(eq(items.characterId, character.id));
	await db.insert(items).values([
		...inventory.map((item) => ({
			characterId: character.id,
			itemKey: item.name,
			amount: item.amount || 1
		}))
	]);

	return true;
}

function isUpdateCharacterPayload(data: any): data is UpdateCharacterPayload {
	if (
		typeof data !== "object" ||
		data === null ||
		typeof data.oldName !== "string" ||
		typeof data.name !== "string" ||
		typeof data.xp !== "number" ||
		typeof data.health !== "number" ||
		typeof data.maxHealth !== "number" ||
		typeof data.level !== "number" ||
		typeof data.stats !== "object" ||
		data.stats === null ||
		typeof data.stats.str !== "number" ||
		typeof data.stats.dex !== "number" ||
		typeof data.stats.int !== "number" ||
		typeof data.stats.vit !== "number" ||
		typeof data.stats.char !== "number" ||
		!Array.isArray(data.inventory) ||
		!data.inventory.every(
			(item: any) =>
				item && typeof item === "object" && typeof item.name === "string" && item.name.length > 0 && typeof item.amount === "number"
		)
	) {
		return false;
	}
	return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await request.json();

	if (!isUpdateCharacterPayload(body)) {
		return new Response("Invalid input", { status: 400 });
	}

	const { oldName, name, stats, exp, health, maxHealth, level, inventory } = body;
	const userId = locals.user.id;

	const success = await updateCharacter(
		userId,
		oldName,
		name,
		stats.str,
		stats.dex,
		stats.int,
		stats.vit,
		stats.char,
		exp,
		health,
		maxHealth,
		level,
		inventory
	);

	return json({ success: success });
};
