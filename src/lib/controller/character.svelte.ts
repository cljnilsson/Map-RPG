//import type { Character } from "$lib/types/character";
import type { Item, VendorItem, InventoryItem } from "$lib/types/item";
import PlayerStore from "$lib/stores/character.svelte";
import type { NPC } from "$lib/types/npc";
import LogController from "$lib/controller/logs.svelte";

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

	public static get stats() {
		return PlayerStore.character.stats;
	}

	public static get id() {
		return PlayerStore.character.id;
	}

	public static get health(): number {
		return PlayerStore.character.health;
	}

	public static set health(v: number) {
		if (v < 0) {
			console.warn("Health cannot be set to a negative value. Setting to 0 instead.");
			PlayerStore.character.health = 0;
			return;
		}

		PlayerStore.character.health = v;

		const { name, health, maxHealth, xp, level, stats } = PlayerStore.character;

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
				stats: stats,
			}),
		});
	}

	public static get conditions(): string[] {
		return PlayerStore.character.conditions;
	}

	public static set conditions(v: string[]) {
		PlayerStore.character.conditions = [...v];
	}

	public static get maxHealth(): number {
		return PlayerStore.character.maxHealth;
	}

	public static get level(): number {
		return PlayerStore.character.level;
	}

	public static get xp(): number {
		return PlayerStore.character.xp;
	}

	public static set xp(v: number) {
		if (v < 0) {
			console.warn("Xp cannot be set to a negative value. Setting to 0 instead.");
			PlayerStore.character.health = 0;
			return;
		}

		PlayerStore.character.xp = v;

		// save in future
		// also handle leveups
	}

	public static get money(): { gold: number; silver: number; copper: number } {
		return PlayerStore.character.money;
	}
	public static set money(m: { gold: number; silver: number; copper: number }) {
		if (m.copper < 0 || m.silver < 0 || m.gold < 0) {
			throw new Error("Money values cannot be negative");
		}

		PlayerStore.character.money = m;

		// Current save does not support money nor does the database itself if I recall
	}

	public static get inventory() {
		return PlayerStore.inventory;
	}

	public static set inventory(v: InventoryItem[]) {
		PlayerStore.inventory = v;
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
			PlayerStore.character.money.gold,
		);

		const priceCopper = PlayerController.moneyToCopper(c, s, g);

		console.log(playerCopper, priceCopper);

		return playerCopper >= priceCopper;
	}

	public static giveItem(i: Item, amount: number = 1): boolean {
		if (i.unique && PlayerStore.inventory.some((slot) => slot.item.name === i.name)) {
			LogController.newLog(`You already have a unique item: ${i.name}.`, "info");
			return false;
		}

		if (PlayerStore.inventory.length < PlayerController.inventorySize) {
			PlayerStore.inventory = [...PlayerStore.inventory, { item: i, amount }];
			const itemLabel = amount > 1 ? `${amount}x ${i.name}` : `a ${i.name}`;
			LogController.newLog(`You received ${itemLabel}.`, "info");
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
			PlayerStore.character.money.gold,
		);

		const priceCopper = PlayerController.moneyToCopper(item.price.copper, item.price.silver, item.price.gold);

		const remainingCopper = playerCopper - priceCopper;
		const { gold, silver, copper } = PlayerController.copperToMoney(remainingCopper);

		PlayerStore.character.money.gold = gold;
		PlayerStore.character.money.silver = silver;
		PlayerStore.character.money.copper = copper;

		PlayerController.giveItem(item);

		return true;
	}

	public static hasItems(items: InventoryItem[]): boolean {
		return items.every(({ item, amount }) =>
			PlayerStore.inventory.some((slot) => slot.item.name === item.name && slot.amount >= amount),
		);
	}

	public static hasItem(name: string): boolean;
	public static hasItem(name: string, amount: number): boolean;
	public static hasItem(name: string, amount?: number): boolean {
		if (amount === undefined) {
			return PlayerStore.inventory.some((slot) => slot.item.name === name);
		}

		const item = PlayerStore.inventory.find((slot) => slot.item.name === name);
		return item !== undefined && item.amount >= amount;
	}

	public static removeItemByName(name: string) {
		const itemIndex = PlayerStore.inventory.findIndex((slot) => slot.item.name === name);

		if (itemIndex !== -1) {
			const removedItem = PlayerStore.inventory[itemIndex];
			PlayerStore.inventory = PlayerStore.inventory.filter((_, index) => index !== itemIndex);

			LogController.newLog(`You lost ${removedItem.item.name}.`, "info");
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
