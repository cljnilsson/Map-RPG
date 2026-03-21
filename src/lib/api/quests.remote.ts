import { db } from "$lib/server/db";
import { command } from "$app/server";
import { quests } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

const QuestSchema = v.object({
	key: v.pipe(v.string(), v.minLength(1)),
	progress: v.number(),
	status: v.union([v.literal("active"), v.literal("completed"), v.literal("failed")]),
});

const UpdateQuestsPayloadSchema = v.object({
	characterId: v.pipe(v.number(), v.minValue(1)), // adjust to minValue(0) if 0 is allowed
	quests: v.array(QuestSchema),
});

type UpdateQuestsPayload = v.InferOutput<typeof UpdateQuestsPayloadSchema>;

async function updateQuest(
	characterId: number,
	key: string,
	progress: number,
	status: "active" | "completed" | "failed",
): Promise<boolean> {
	const rows = await db
		.update(quests)
		.set({ progress, status })
		.where(and(eq(quests.characterId, characterId), eq(quests.key, key)));

	return rows.changes > 0;
}

async function createQuest(
	characterId: number,
	key: string,
	progress: number,
	status: "active" | "completed" | "failed",
) {
	const rows = await db.insert(quests).values({ characterId, key: key, progress, status });

	return rows.changes > 0;
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

async function update({ quests, characterId }: UpdateQuestsPayload) {
	// In theory should block requests if user is not logged in
	await getUser();

	let failedQuests: string[] = [];

	// Loop quests
	for (const q of quests) {
		if (await questExists(characterId, q.key)) {
			console.log("Quest", q.key, "exists, updating");
			const success = await updateQuest(characterId, q.key, q.progress, q.status);
			if (!success) {
				failedQuests = [...failedQuests, q.key];
			}
		} else {
			console.log("Quest", q.key, " does NOT exist, creating new");
			await createQuest(characterId, q.key, q.progress, q.status);
		}
	}

	return { success: failedQuests.length === 0, failedQuests };
}

export const updateOneQuest = command(UpdateQuestsPayloadSchema, update);