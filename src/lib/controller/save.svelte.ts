import { getRequest, postRequest } from "$lib/utils/request";
import CharacterStore from "$lib/stores/character.svelte";

type CharacterInput = {
	oldName: string,
	name: string,
	health: number,
	maxHealth: number,
	exp: number,
	level: number,
	stats: {
		str: number,
		dex: number,
		int: number,
		vit: number,
		char: number
	},
	inventory: {
		name: string, // Perhaps a bit missleading, might rename the 'name' attribute to key at some point
		amount: number
	}[]
};

export class SaveController {
	// might rework it in the future so oldname and name are not needed but for now it is needed to have the name currently used in the database
	public static async saveCharacter(newName: string) {
		await postRequest<{}, CharacterInput>("/api/characters/save", {
			oldName: CharacterStore.character.name,
			name: newName,
			health: CharacterStore.character.health,
			maxHealth: CharacterStore.character.maxHealth,
			exp: CharacterStore.character.xp,
			level: CharacterStore.character.level,
			stats: {
				str: CharacterStore.character.stats.str,
				dex: CharacterStore.character.stats.dex,
				int: CharacterStore.character.stats.int,
				vit: CharacterStore.character.stats.vit,
				char: CharacterStore.character.stats.char
			},
			inventory: CharacterStore.inventory.map((item) => ({
				name: item.id,
				amount: item.amount
			})),
		}
		);
	}

	public static async saveWindows(newX: number, newY: number, uniqueKey: string) {
		const resp = await postRequest<{ success: boolean }, { key: string, x: number, y: number, characterId: number }>("/api/characters/save/windows", {
			key: uniqueKey,
			x: newX,
			y: newY,
			characterId: CharacterStore.character.id
		}
		);

		const { success } = resp;
		if (!success) {
			console.error("Failed to save window position");
			return;
		}

		console.log(`Window position saved: ${uniqueKey} at (${newX}, ${newY})`);
	}

	public static saveCity() {

	}

	public static saveFlag() {

	}
}
