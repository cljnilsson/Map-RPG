//import type { Character } from "$lib/types/character";
import type { Item, VendorItem } from "$lib/types/item";
import PlayerStore from "$lib/stores/character.svelte";
import type {NPC} from "$lib/types/npc";
import LogStore from "$lib/stores/logs.svelte";

export class CharacterController {}

export class NPCController extends CharacterController {}

export class PlayerController extends CharacterController {
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	public static moneyToCopper(c: number, s: number, g: number): number {
		return c + s * 10 + g * 100;
	}

	public static copperToMoney(totalCopper: number): { gold: number; silver: number; copper: number } {
		const gold = Math.floor(totalCopper / 100);
		const silver = Math.floor((totalCopper % 100) / 10);
		const copper = totalCopper % 10;

		return { gold, silver, copper };
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

	public static buyItem(item: VendorItem): boolean {
		if (!PlayerController.canAfford(item.price.copper, item.price.silver, item.price.gold)) {
			LogStore.logs = [
				...LogStore.logs,
				{
					timestamp: new Date(),
					message: "You cannot afford this item.",
					type: "warning"
				}
			];
			return false;
		}

		if (PlayerStore.inventory.length >= PlayerController.inventorySize) {
			LogStore.logs = [
				...LogStore.logs,
				{
					timestamp: new Date(),
					message: "You need more inventory space.",
					type: "warning"
				}
			];
			return false;
		}

		const playerCopper = PlayerController.moneyToCopper(
			PlayerStore.character.money.copper,
			PlayerStore.character.money.silver,
			PlayerStore.character.money.gold
		);

		const priceCopper = PlayerController.moneyToCopper(
			item.price.copper,
			item.price.silver,
			item.price.gold
		);

		const remainingCopper = playerCopper - priceCopper;
		const { gold, silver, copper } = PlayerController.copperToMoney(remainingCopper);

		PlayerStore.character.money.gold = gold;
		PlayerStore.character.money.silver = silver;
		PlayerStore.character.money.copper = copper;

		PlayerController.giveItem(item);

		return true;
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
