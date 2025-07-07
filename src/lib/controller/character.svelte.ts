//import type { Character } from "$lib/types/character";
import type { Item } from "$lib/types/item";
import PlayerStore from "$lib/stores/character.svelte";
import LogStore from "$lib/stores/logs.svelte";

export class CharacterController {}

export class NPC extends CharacterController {}

export class PlayerController extends CharacterController {
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	private static moneyToCopper(c: number, s: number, g: number): number {
		return c + s * 10 + g * 100;
	}

	public static canAfford(c: number, s: number, g: number): boolean {
		const playerCopper = PlayerController.moneyToCopper(
			PlayerStore.character.money.copper,
			PlayerStore.character.money.copper,
			PlayerStore.character.money.copper
		);
		const priceCopper = PlayerController.moneyToCopper(c, s, g);

		return playerCopper >= priceCopper;
	}

	public static giveItem(i: Item): boolean {
		if (PlayerStore.inventory.length < PlayerController.inventorySize) {
			PlayerStore.inventory = [...PlayerStore.inventory, i];
			LogStore.logs = [
				...LogStore.logs,
				{
					timestamp: new Date(),
					message: `You received a ${i.name}.`,
					type: "info"
				}
			];
			return true;
		}

		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new Date(),
				message: "You need more inventory space",
				type: "info"
			}
		];
		return false;
	}

	public static removeItemByName(name: string) {
		const itemIndex = PlayerStore.inventory.findIndex((item) => item.name === name);

		if (itemIndex !== -1) {
			const removedItem = PlayerStore.inventory[itemIndex];
			PlayerStore.inventory = PlayerStore.inventory.filter((_, index) => index !== itemIndex);
			LogStore.logs = [
				...LogStore.logs,
				{
					timestamp: new Date(),
					message: `You lost ${removedItem.name}.`,
					type: "info"
				}
			];
		} else {
			console.error("Trying to remove item that does not exist");
		}
	}
}
