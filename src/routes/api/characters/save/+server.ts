import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters } from "$lib/server/db/schema";
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
) {
	await db
		.update(characters)
		.set({ name, exp, health, maxHealth, level })
		.where(and(eq(characters.userId, userId), eq(characters.name, oldName)));

	// Also update the stats seperately?
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

	await updateCharacter(userId, oldName, name, stats.str, stats.dex, stats.int, stats.vit, stats.charisma, exp, health, maxHealth, level);

	return json({ success: true });
};
