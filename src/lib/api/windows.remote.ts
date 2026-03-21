import { db } from "$lib/server/db";
import { command } from "$app/server";
import { windowPositions } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

async function getAllWindowPositions(characterId: number) {
	const exists = await db.select().from(windowPositions).where(eq(windowPositions.characterId, characterId));

	return exists;
}

const GetWindowPositionsSchema = v.object({
	characterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
});

type GetWindowPositionsData = v.InferOutput<typeof GetWindowPositionsSchema>;

async function get({ characterId }: GetWindowPositionsData) {
	// In theory should block requests if user is not logged in
	await getUser();

	return {
		success: true,
		positions: await getAllWindowPositions(characterId),
	};
}

const UpdateWindowPositionsSchema = v.object({
	key: v.pipe(v.string(), v.minLength(1)),
	x: v.number(),
	y: v.number(),
	characterId: v.pipe(v.number(), v.minValue(0)),
});

type UpdateWindowPositionsData = v.InferOutput<typeof UpdateWindowPositionsSchema>;

async function updateWindowPositions(characterId: number, key: string, x: number, y: number): Promise<boolean> {
	const rows = await db
		.update(windowPositions)
		.set({ x, y })
		.where(and(eq(windowPositions.characterId, characterId), eq(windowPositions.windowKey, key)));

	return rows.changes > 0;
}

async function createWindowPosition(characterId: number, key: string, x: number, y: number) {
	const rows = await db.insert(windowPositions).values({ characterId, windowKey: key, x, y });

	return rows.changes > 0;
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

async function update({ key, x, y, characterId }: UpdateWindowPositionsData) {
	// In theory should block requests if user is not logged in
	await getUser();

	if (await windowPositionsExists(characterId, key)) {
		console.log("Window position exists, updating position");
		const success = await updateWindowPositions(characterId, key, x, y);
		return { success };
	}

	console.log("Window position does NOT exist, creating new position");
	await createWindowPosition(characterId, key, x, y);
	return { success: true };
}

export const getWindowPositionsByCharacter = command(GetWindowPositionsSchema, get);
export const updateWindowPositionsByCharacter = command(UpdateWindowPositionsSchema, update);