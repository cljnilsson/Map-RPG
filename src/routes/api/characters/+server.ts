import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

async function getCharacters(userId: number) {
	return await db
		.select()
		.from(characters)
		.where(eq(characters.userId, userId))
		.all();
}

export const GET: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userId = locals.user.id;
	const existing = await getCharacters(userId);

	return json({ success: true, characters: existing });
};