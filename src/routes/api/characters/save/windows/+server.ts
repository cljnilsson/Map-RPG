import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { windowPositions } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

type UpdateCharacterPayload = {
	key: string,
	x: number,
	y: number,
	characterId: number
};

async function updateWindowPositions(
	characterId: number,
	key: string,
	x: number,
	y: number
): Promise<boolean> {
	await db
		.update(windowPositions)
		.set({ x, y })
		.where(and(eq(windowPositions.characterId, characterId), eq(windowPositions.windowKey, key)));

	return true;
}

async function createWindowPosition(characterId: number,
	key: string,
	x: number,
	y: number) {
	await db
		.insert(windowPositions)
		.values({ characterId, windowKey: key, x, y });
}

async function windowPositionsExists(characterId: number, key: string): Promise<boolean> {
	const exists = await db
		.select()
		.from(windowPositions)
		.where(and(eq(windowPositions.characterId, characterId), eq(windowPositions.windowKey, key)))
		.get();

	return !!exists;
}

function isUpdateCharacterPayload(data: any): data is UpdateCharacterPayload {
	if (
		typeof data !== "object" ||
		data === null ||
		typeof data.key !== "string" ||
		typeof data.x !== "number" ||
		typeof data.y !== "number" ||
		typeof data.characterId !== "number"
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

	const { key, x, y, characterId } = body;

	if (await windowPositionsExists(characterId, key)) {
		console.log("Window position does NOT exist, creating new position");
		await createWindowPosition(characterId, key, x, y);
		return json({ success: true });
	}

	console.log("Window position does exist, updating new position");
	const success = await updateWindowPositions(
		characterId,
		key,
		x,
		y
	);

	return json({ success: success });
};
