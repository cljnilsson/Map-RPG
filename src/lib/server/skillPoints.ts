import { and, eq } from "drizzle-orm";
import type { db as database } from "#lib/server/db/index.js";
import { characters, stats } from "#lib/server/db/schema/character.js";
import { stat } from "#lib/server/db/schema/stat.js";
import type { Character } from "#lib/types/character.js";

const statNames = { str: "Strength", dex: "Dexterity", int: "Intelligence", vit: "Vitality", char: "Charisma" } as const;

export function allocatePoints(db: typeof database, userId: string, characterId: number, allocation: Character["stats"]) {
	const amounts = Object.values(allocation);
	const spent = amounts.reduce((sum, amount) => sum + amount, 0);
	if (amounts.some((amount) => !Number.isSafeInteger(amount) || amount < 0) || !Number.isSafeInteger(spent) || spent <= 0) {
		throw new Error("Choose a positive, whole number of points to spend.");
	}
	return db.transaction((tx) => {
		const character = tx
			.select({ unspentSkillPoints: characters.unspentSkillPoints })
			.from(characters)
			.where(and(eq(characters.id, characterId), eq(characters.userId, userId)))
			.get();
		if (!character) throw new Error("Character not found.");
		if (spent > character.unspentSkillPoints) throw new Error("Not enough unspent skill points. Reload and try again.");
		const current = tx
			.select({ id: stats.id, name: stat.name, value: stats.value })
			.from(stats)
			.innerJoin(stat, eq(stats.statId, stat.id))
			.where(eq(stats.characterId, characterId))
			.all();
		const updated = {} as Character["stats"];
		for (const key of Object.keys(statNames) as (keyof Character["stats"])[]) {
			const entry = current.find((row) => row.name === statNames[key]);
			if (!entry) throw new Error(`Missing character stat: ${statNames[key]}.`);
			updated[key] = entry.value + allocation[key];
			tx.update(stats).set({ value: updated[key] }).where(eq(stats.id, entry.id)).run();
		}
		const unspentSkillPoints = character.unspentSkillPoints - spent;
		tx.update(characters).set({ unspentSkillPoints }).where(eq(characters.id, characterId)).run();
		return { stats: updated, unspentSkillPoints };
	});
}