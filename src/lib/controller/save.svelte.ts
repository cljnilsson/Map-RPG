import { postRequest } from "$lib/utils/request";
import CharacterStore from "$lib/stores/character.svelte";
import QuestController from "./quest.svelte";

type CharacterInput = {
	oldName: string;
	name: string;
	health: number;
	maxHealth: number;
	exp: number;
	level: number;
	stats: {
		str: number;
		dex: number;
		int: number;
		vit: number;
		char: number;
	};
	inventory: {
		name: string; // Perhaps a bit missleading, might rename the 'name' attribute to key at some point
		amount: number;
	}[];
};

type QuestInput = {
	characterId: number;
	quests: {
		key: string;
		progress: number;
		status: "active" | "completed" | "failed";
	}[];
};

export class SaveController {
	// might rework it in the future so oldname and name are not needed but for now it is needed to have the name currently used in the database
	public static async saveCharacter(newName?: string) {
		await postRequest<unknown, CharacterInput>("/api/characters/save", {
			oldName: CharacterStore.character.name,
			name: newName ?? CharacterStore.character.name,
			health: CharacterStore.character.health,
			maxHealth: CharacterStore.character.maxHealth,
			exp: CharacterStore.character.xp,
			level: CharacterStore.character.level,
			stats: {
				str: CharacterStore.character.stats.str,
				dex: CharacterStore.character.stats.dex,
				int: CharacterStore.character.stats.int,
				vit: CharacterStore.character.stats.vit,
				char: CharacterStore.character.stats.char,
			},
			inventory: CharacterStore.inventory.map((slot) => ({
				name: slot.item.id,
				amount: slot.amount,
			})),
		});
	}

	public static async saveWindows(newX: number, newY: number, uniqueKey: string) {
		const resp = await postRequest<{ success: boolean }, { key: string; x: number; y: number; characterId: number }>(
			"/api/characters/save/windows",
			{
				key: uniqueKey,
				x: newX,
				y: newY,
				characterId: CharacterStore.character.id,
			},
		);

		const { success } = resp;
		if (!success) {
			console.error("Failed to save window position");
			return;
		}

		console.log(`Window position saved: ${uniqueKey} at (${newX}, ${newY})`);
	}

	public static async saveQuests() {
		await postRequest<unknown, QuestInput>("/api/characters/save/quests", {
			characterId: 4,
			quests: QuestController.quests.map((q) => {
				return {
					key: q.id,
					progress: q.progress,
					status: q.status,
				};
			}),
		});
	}

	public static saveCity() {}

	public static saveFlag() {}
}