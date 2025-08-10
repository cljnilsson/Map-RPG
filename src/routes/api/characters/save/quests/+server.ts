import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { quests } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

type UpdateQuestsPayload = {
	characterId: number;
	quests: {
		key: string;
		progress: number;
		status: "active" | "completed" | "failed";
	}[];
};

async function updateQuest(
	characterId: number,
	key: string,
	progress: number,
	status: "active" | "completed" | "failed"
): Promise<boolean> {
	await db
		.update(quests)
		.set({ progress, status })
		.where(and(eq(quests.characterId, characterId), eq(quests.key, key)));

	return true;
}

async function createQuest(characterId: number, key: string, progress: number, status: "active" | "completed" | "failed") {
	await db.insert(quests).values({ characterId, key: key, progress, status });
}

async function questExists(characterId: number, key: string): Promise<boolean> {
	const exists = await db
		.select()
		.from(quests)
		.where(and(eq(quests.characterId, characterId), eq(quests.key, key)))
		.get();
	console.log(exists);
	return !!exists;
}

function isUpdateQuestsPayload(data: any): data is UpdateQuestsPayload {
	if (typeof data !== "object" || data === null || typeof data.characterId !== "number" || !Array.isArray(data.quests)) {
		return false;
	}

	for (const q of data.quests) {
		if (
			typeof q !== "object" ||
			q === null ||
			typeof q.key !== "string" ||
			typeof q.progress !== "number" ||
			!["active", "completed", "failed"].includes(q.status)
		) {
			return false;
		}
	}

	return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await request.json();

	if (!isUpdateQuestsPayload(body)) {
		return new Response("Invalid input", { status: 400 });
	}

	const { quests, characterId } = body;
	let failedQuests: string[] = [];

	// Loop quests
	for (const q of quests) {
		if (await questExists(characterId, q.key)) {
			console.log("Quest" + q.key + "exists, updating");
			const success = await updateQuest(characterId, q.key, q.progress, q.status);
			if (!success) {
				failedQuests = [...failedQuests, q.key];
			}
		} else {
			console.log("Quest" + q.key + " does NOT exist, creating new");
			await createQuest(characterId, q.key, q.progress, q.status);
		}
	}

	return json({ success: true });
};
