import { describe, it, expect, beforeEach } from "vitest";
import { getItem } from "$lib/data/items";
import { PlayerController } from "$lib/controller/character.svelte";
import PlayerStore from "$lib/stores/character.svelte";

describe("Inventory", () => {
	beforeEach(() => {
		// Reset or mock PlayerController inventory before each test
		PlayerStore.inventory = [
			{ item: getItem("test-item-1"), amount: 1 },
			{ item: getItem("test-item-2"), amount: 1 },
			{ item: getItem("test-item-3"), amount: 3 }
			// Add other items if needed
		];
	});

	it("Has item", () => {
		expect(PlayerController.hasItem("Magical Stone")).toBe(true);
		expect(PlayerController.hasItem("Magical Stone", 3)).toBe(true);
		expect(PlayerController.hasItem("Magical Stone", 5)).toBe(false);
		expect(PlayerController.hasItem("Magical Rock")).toBe(false);
	});

	it("Has items", () => {
		const testItems = [
			{ item: getItem("test-item-1"), amount: 1 },
			{ item: getItem("test-item-2"), amount: 1 },
			{ item: getItem("test-item-3"), amount: 4 },
			{ item: getItem("test-chest-key1"), amount: 1 }
		];

		expect(PlayerController.hasItems([testItems[0], testItems[1]])).toBe(true);
		expect(PlayerController.hasItems([testItems[0]])).toBe(true);
		expect(PlayerController.hasItems([testItems[0], testItems[2]])).toBe(false); // False because test-item-3 has only 3 in inventory
		expect(PlayerController.hasItems([testItems[0], testItems[3]])).toBe(false);
	});

	it("Remove item", () => {
		expect(PlayerController.hasItem("Magical Stone")).toBe(true);

		PlayerController.removeItemByName("Magical Stone");

		expect(PlayerController.hasItem("Magical Stone")).toBe(false);
	});
});
