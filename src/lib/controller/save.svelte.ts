import { PlayerController } from "$lib/controller/character.svelte";
import QuestController from "./quest.svelte";
import { updateWindowPositionsByCharacter } from "$lib/api/windows.remote";
import { updateOneQuest } from "$lib/api/quests.remote";
import { saveCharacter } from "$lib/api/character.remote";

class SaveController {
	// might rework it in the future so oldname and name are not needed but for now it is needed to have the name currently used in the database
	public async saveCharacter(newName?: string) {
		await saveCharacter({
			oldName: PlayerController.name,
			name: newName ?? PlayerController.name,
			health: PlayerController.health,
			maxHealth: PlayerController.maxHealth,
			xp: PlayerController.xp,
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
		const success = await updateWindowPositionsByCharacter({
			key: uniqueKey,
			x: newX,
			y: newY,
			characterId: PlayerController.id,
		});

		if (!success) {
			console.error("Failed to save window position");
			return;
		}

		console.log(`Window position saved: ${uniqueKey} at (${newX}, ${newY})`);
	}

	public async saveQuests() {
		await updateOneQuest({
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