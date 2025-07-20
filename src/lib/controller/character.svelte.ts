//import type { Character } from "$lib/types/character";
import type { Item, VendorItem } from "$lib/types/item";
import PlayerStore from "$lib/stores/character.svelte";
import type {NPC} from "$lib/types/npc";
import { LogController } from "$lib/controller/logs.svelte";

export class CharacterController {}

export class NPCController extends CharacterController {}

export class PlayerController extends CharacterController {
	// ---------------
	// Variables
	// ---------------
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get health(): number {
		return PlayerStore.character.health;
	}

	public static set health(v: number) {
		if(v < 0) {
			console.warn("Health cannot be set to a negative value. Setting to 0 instead.");
			PlayerStore.character.health = 0;
			return;
		}

		PlayerStore.character.health = v;

		const {name, health, maxHealth, xp, level, stats} = PlayerStore.character;

		fetch("/api/characters/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				oldName: name,
				name: name,
				health: health,
				maxHealth: maxHealth,
				exp: xp,
				level: level,
				stats: stats
			})
		});
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static moneyToCopper(c: number, s: number, g: number): number {
		if (c < 0 || s < 0 || g < 0) {
			throw new Error("Money values cannot be negative");
		}
		
		return c + s * 10 + g * 100;
	}

	public static copperToMoney(totalCopper: number): { gold: number; silver: number; copper: number } {
		if (totalCopper < 0) {
			throw new Error("Total copper value cannot be negative");
		}

		const gold = Math.floor(totalCopper / 100);
		const silver = Math.floor((totalCopper % 100) / 10);
		const copper = totalCopper % 10;

		return { gold, silver, copper };
	}

	public static canAfford(c: number, s: number, g: number): boolean {
		if (c < 0 || s < 0 || g < 0) {
			throw new Error("Price values cannot be negative");
		}

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
		if (i.unique && PlayerStore.inventory.some((item) => item.name === i.name)) {
			LogController.newLog(`You already have a unique item: ${i.name}.`, "info");
			return false;
		}

		if (PlayerStore.inventory.length < PlayerController.inventorySize) {
			PlayerStore.inventory = [...PlayerStore.inventory, { ...i, amount: 1 }];
			LogController.newLog(`You received a ${i.name}.`, "info");
			return true;
		}

		LogController.newLog("You need more inventory space.", "warning");
		return false;
	}

	public static buyItem(item: VendorItem): boolean {
		if (!PlayerController.canAfford(item.price.copper, item.price.silver, item.price.gold)) {
			LogController.newLog("You cannot afford this item.", "warning");
			return false;
		}

		if (PlayerStore.inventory.length >= PlayerController.inventorySize) {
			LogController.newLog("You need more inventory space.", "warning");
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

			LogController.newLog(`You lost ${removedItem.name}.`, "info");
		} else {
			console.error("Trying to remove item that does not exist");
		}
	}

	public static attack(amount: number, modifier: "str" | "int" | "vit" | "char" | "dex", target: NPC) {
		// use npc.damage in future
		const damage = amount + PlayerStore.character.stats[modifier];
		target.health -= damage;

		LogController.newLog(`You dealt ${damage} to ${target.name}.`, "info");
	}

	public static damage(amount: number) {
		if (amount <= 0) {
			console.error("Damage amount must be greater than zero");
			return;
		}

		PlayerStore.character.health -= amount;

		LogController.newLog(`You took ${amount} damage.`, "warning");
	}
}