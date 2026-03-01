//import type { Character } from "$lib/types/character";
import type { Item, VendorItem, InventoryItem } from "$lib/types/item";
import type { Character } from "$lib/types/character";
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

	public static get exists(): boolean {
		return PlayerStore.character != null;
	}

	private static safeGetCharacter(): Character {
		const character = PlayerStore.character;

		if (character === null) {
			throw new Error("Trying to get from character but player has no character");
		}

		return character;
	}

	public static get stats() {
		return PlayerController.safeGetCharacter().stats;
	}

	public static get imagePath() {
		return PlayerController.safeGetCharacter().imagePath;
	}

	public static set imagePath(v: string) {
		PlayerController.safeGetCharacter().imagePath = v;
	}

	public static get id() {
		return PlayerController.safeGetCharacter().id;
	}

	public static get health(): number {
		return PlayerController.safeGetCharacter().health;
	}

	public static set health(v: number) {
		if (v < 0) {
			console.warn("Health cannot be set to a negative value. Setting to 0 instead.");
			PlayerController.safeGetCharacter().health = 0;
			return;
		}

		PlayerController.safeGetCharacter().health = v;

		const { name, health, maxHealth, xp, level, stats } = PlayerController.safeGetCharacter();

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
		return PlayerController.safeGetCharacter().conditions;
	}

	public static set conditions(v: string[]) {
		PlayerController.safeGetCharacter().conditions = [...v];
	}

	public static get age(): number {
		return PlayerController.safeGetCharacter().age;
	}

	public static set age(v: number) {
		PlayerController.safeGetCharacter().age = v;
	}

	public static get race(): string {
		return PlayerController.safeGetCharacter().race;
	}

	public static set race(v: string) {
		PlayerController.safeGetCharacter().race = v;
	}

	public static get gender(): "Male" | "Female" | "Unknown" {
		return PlayerController.safeGetCharacter().gender;
	}

	public static set gender(v: "Male" | "Female" | "Unknown") {
		PlayerController.safeGetCharacter().gender = v;
	}

	public static get maxHealth(): number {
		return PlayerController.safeGetCharacter().maxHealth;
	}

	public static get level(): number {
		return PlayerController.safeGetCharacter().level;
	}

	public static get xp(): number {
		return PlayerController.safeGetCharacter().xp;
	}

	public static set xp(v: number) {
		if (v < 0) {
			console.warn("Xp cannot be set to a negative value. Setting to 0 instead.");
			PlayerController.safeGetCharacter().health = 0;
			return;
		}

		PlayerController.safeGetCharacter().xp = v;

		// save in future
		// also handle leveups
	}

	public static get money(): { gold: number; silver: number; copper: number } {
		return PlayerController.safeGetCharacter().money;
	}
	public static set money(m: { gold: number; silver: number; copper: number }) {
		if (m.copper < 0 || m.silver < 0 || m.gold < 0) {
			throw new Error("Money values cannot be negative");
		}

		PlayerController.safeGetCharacter().money = m;

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
			PlayerController.safeGetCharacter().money.copper,
			PlayerController.safeGetCharacter().money.silver,
			PlayerController.safeGetCharacter().money.gold,
		);

		const priceCopper = PlayerController.moneyToCopper(c, s, g);

		console.log(playerCopper, priceCopper);

		return playerCopper >= priceCopper;
	}

	public static giveItem(i: Item, amount: number = 1): boolean {
		if (i.unique && PlayerStore.inventory.some((slot) => slot.item.name === i.name)) {
			LogController.newLogSimple(`You already have a unique item: ${i.name}.`, "info");
			return false;
		}

		if (PlayerStore.inventory.length < PlayerController.inventorySize) {
			PlayerStore.inventory = [...PlayerStore.inventory, { item: i, amount }];
			const itemLabel = amount > 1 ? `${amount}x ${i.name}` : `a ${i.name}`;
			LogController.newLogSimple(`You received ${itemLabel}.`, "info");
			return true;
		}

		LogController.newLogSimple("You need more inventory space.", "warning");
		return false;
	}

	public static buyItem(item: VendorItem): boolean {
		if (!PlayerController.canAfford(item.price.copper, item.price.silver, item.price.gold)) {
			LogController.newLogSimple("You cannot afford this item.", "warning");
			return false;
		}

		if (PlayerStore.inventory.length >= PlayerController.inventorySize) {
			LogController.newLogSimple("You need more inventory space.", "warning");
			return false;
		}

		const playerCopper = PlayerController.moneyToCopper(
			PlayerController.safeGetCharacter().money.copper,
			PlayerController.safeGetCharacter().money.silver,
			PlayerController.safeGetCharacter().money.gold,
		);

		const priceCopper = PlayerController.moneyToCopper(item.price.copper, item.price.silver, item.price.gold);

		const remainingCopper = playerCopper - priceCopper;
		const { gold, silver, copper } = PlayerController.copperToMoney(remainingCopper);

		PlayerController.safeGetCharacter().money.gold = gold;
		PlayerController.safeGetCharacter().money.silver = silver;
		PlayerController.safeGetCharacter().money.copper = copper;

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

			LogController.newLogSimple(`You lost ${removedItem.item.name}.`, "info");
		} else {
			console.error("Trying to remove item that does not exist");
		}
	}

	public static attack(amount: number, modifier: "str" | "int" | "vit" | "char" | "dex", target: NPC) {
		// use npc.damage in future
		const damage = amount + PlayerController.safeGetCharacter().stats[modifier];
		target.health -= damage;

		LogController.newLogSimple(`You dealt ${damage} to ${target.name}.`, "info");
	}

	public static damage(amount: number) {
		if (amount <= 0) {
			console.error("Damage amount must be greater than zero");
			return;
		}

		PlayerController.safeGetCharacter().health -= amount;

		LogController.newLogSimple(`You took ${amount} damage.`, "warning");
	}
}