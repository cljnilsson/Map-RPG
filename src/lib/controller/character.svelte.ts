//import type { Character } from "$lib/types/character";
import type { Item } from "$lib/types/item";
import PlayerStore from "$lib/stores/character.svelte";
import type {NPC} from "$lib/types/npc";
import LogStore from "$lib/stores/logs.svelte";

export class CharacterController {}

export class NPCController extends CharacterController {}

export class PlayerController extends CharacterController {
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	private static moneyToCopper(c: number, s: number, g: number): number {
		return c + s * 10 + g * 100;
	}

	public static canAfford(c: number, s: number, g: number): boolean {
		const playerCopper = PlayerController.moneyToCopper(
			PlayerStore.character.money.copper,
			PlayerStore.character.money.silver,
			PlayerStore.character.money.gold
		);

		const priceCopper = PlayerController.moneyToCopper(c, s, g);

		console.log(playerCopper, priceCopper);

		return playerCopper >= priceCopper;
	}

	// Give specifically 1 of item
	public static giveItem(i: Item): boolean {
		if (PlayerStore.inventory.length < PlayerController.inventorySize) {
			PlayerStore.inventory = [...PlayerStore.inventory, {...i, amount: 1}];
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

	public static hasItem(name: string): boolean;
	public static hasItem(name: string, amount: number): boolean;
	public static hasItem(name: string, amount?: number): boolean {
		if (amount === undefined) {
			return PlayerStore.inventory.some((item) => item.name === name);
		}

		const item = PlayerStore.inventory.find((item) => item.name === name);
		return item !== undefined && item.amount >= amount;
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

	public static attack(amount: number, modifier: "str" | "int" | "vit" | "char" | "dex", target: NPC) {
		// use npc.damage in future
		const damage = amount + PlayerStore.character.stats[modifier];
		target.health -= damage;

		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new Date(),
				message: `You dealt ${damage} to ${target.name}.`,
				type: "info"
			}
		];
	}

	public static damage(amount: number) {
		if (amount <= 0) {
			console.error("Damage amount must be greater than zero");
			return;
		}

		PlayerStore.character.health -= amount;

		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new Date(),
				message: `You took ${amount} damage.`,
				type: "warning"
			}
		];
	}
}
