import { postRequest } from "$lib/utils/request";
import { PlayerController } from "$lib/controller/character.svelte";
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

class SaveController {
	// might rework it in the future so oldname and name are not needed but for now it is needed to have the name currently used in the database
	public async saveCharacter(newName?: string) {
		await postRequest<unknown, CharacterInput>("/api/characters/save", {
			oldName: PlayerController.name,
			name: newName ?? PlayerController.name,
			health: PlayerController.health,
			maxHealth: PlayerController.maxHealth,
			exp: PlayerController.xp,
			level: PlayerController.level,
			stats: {
				str: PlayerController.stats.str,
				dex: PlayerController.stats.dex,
				int: PlayerController.stats.int,
				vit: PlayerController.stats.vit,
				char: PlayerController.stats.char,
			},
			inventory: PlayerController.inventory.map((slot) => ({
				name: slot.item.id,
				amount: slot.amount,
			})),
		});
	}

	public async saveWindows(newX: number, newY: number, uniqueKey: string) {
		const resp = await postRequest<{ success: boolean }, { key: string; x: number; y: number; characterId: number }>(
			"/api/characters/save/windows",
			{
				key: uniqueKey,
				x: newX,
				y: newY,
				characterId: PlayerController.id,
			},
		);

		const { success } = resp;
		if (!success) {
			console.error("Failed to save window position");
			return;
		}

		console.log(`Window position saved: ${uniqueKey} at (${newX}, ${newY})`);
	}

	public async saveQuests() {
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

	public saveCity() {}

	public saveFlag() {}
}

const instance = new SaveController();

export default instance;