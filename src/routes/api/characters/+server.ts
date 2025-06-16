import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { characters, stats, stat} from "$lib/server/db/schema";
import type { Character } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

type CharacterWithStats = Character & {
	stats: {
		name: string;
		value: number;
	}[];
};

async function getCharacters(userId: number) {
	return await db
		.select()
		.from(characters)
		.where(eq(characters.userId, userId))
		.leftJoin(stats, eq(characters.id, stats.characterId))
		.leftJoin(stat, eq(stats.statId, stat.id));
}

// Not the most pretty solution but I just want it as a demo for now
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const userId = locals.user.id;
	const existing = await getCharacters(userId);

	const grouped: CharacterWithStats[] = [];

	for (const row of existing) {
		const charId = row.characters.id;
		let character = grouped.find((c) => c.id === charId);

		if (!character) {
			character = {
				...row.characters,
				stats: []
			};
			grouped.push(character);
		}

		if (row.stat && row.stats) {
			character.stats.push({
				name: row.stat.name,
				value: row.stats.value
			});
		}
	}

	return json({ success: true, characters: grouped });
};
