import { getRequest, postRequest } from "$lib/utils/request";
import CharacterStore from "$lib/stores/character.svelte";

export class SaveController {
	public static async saveCharacter() {
		await postRequest("/api/characters/save", {
			oldName: "Alice",
			name: "Test333333",
			health: 25,
			maxHealth: 100,
			exp: 10,
			level: 1,
			stats: {
				str: 5,
				dex: 8,
				int: 9,
				vit: 10,
				char: 5
			},
			inventory: CharacterStore.inventory.map((item) => ({
				name: item.id, // Perhaps a bit missleading, might rename the 'name' attribute to key at some point
				amount: item.amount
			})),
		}
		);
	}

	public static async saveWindows(newX: number, newY: number, uniqueKey: string) {
		const resp = await postRequest("/api/characters/save/windows", {
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
