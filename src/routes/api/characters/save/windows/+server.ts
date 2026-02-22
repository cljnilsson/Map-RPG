import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { windowPositions } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { auth } from "$lib/auth";

const UpdateCharacterPayloadSchema = v.object({
	key: v.pipe(v.string(), v.minLength(1)),
	x: v.number(),
	y: v.number(),
	characterId: v.pipe(v.number(), v.minValue(0)),
});

type UpdateCharacterPayload = v.InferOutput<typeof UpdateCharacterPayloadSchema>;

async function updateWindowPositions(characterId: number, key: string, x: number, y: number): Promise<boolean> {
	await db
		.update(windowPositions)
		.set({ x, y })
		.where(and(eq(windowPositions.characterId, characterId), eq(windowPositions.windowKey, key)));

	return true;
}

async function createWindowPosition(characterId: number, key: string, x: number, y: number) {
	await db.insert(windowPositions).values({ characterId, windowKey: key, x, y });
}

async function windowPositionsExists(characterId: number, key: string): Promise<boolean> {
	const exists = await db
		.select()
		.from(windowPositions)
		.where(and(eq(windowPositions.characterId, characterId), eq(windowPositions.windowKey, key)))
		.get();
	console.log(exists);
	return !!exists;
}

function isUpdateWindowPositionPayload(data: unknown): data is UpdateCharacterPayload {
	return v.safeParse(UpdateCharacterPayloadSchema, data).success;
}

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session || !session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await request.json();

	if (!isUpdateWindowPositionPayload(body)) {
		return new Response("Invalid input", { status: 400 });
	}

	const { key, x, y, characterId } = body;

	if (await windowPositionsExists(characterId, key)) {
		console.log("Window position exists, updating position");
		const success = await updateWindowPositions(characterId, key, x, y);
		return json({ success });
	}

	console.log("Window position does NOT exist, creating new position");
	await createWindowPosition(characterId, key, x, y);
	return json({ success: true });
};