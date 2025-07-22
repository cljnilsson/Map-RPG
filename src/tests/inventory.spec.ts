import { describe, it, expect, beforeEach } from "vitest";
import { getItem } from "$lib/data/items";
import { PlayerController } from "$lib/controller/character.svelte";
import PlayerStore from "$lib/stores/character.svelte";

describe("Inventory", () => {
	beforeEach(() => {
		// Reset or mock PlayerController inventory before each test
		PlayerStore.inventory = [
			{ ...getItem("test-item-1"), amount: 1 },
			{ ...getItem("test-item-2"), amount: 1 },
			{ ...getItem("test-item-3"), amount: 3 }
			// Add other items if needed
		];
	});

	it("Has item", () => {
		expect(PlayerController.hasItem("Magical Stone")).toBe(true);
		expect(PlayerController.hasItem("Magical Stone", 3)).toBe(true);
		expect(PlayerController.hasItem("Magical Stone", 5)).toBe(false);
		expect(PlayerController.hasItem("Magical Rock")).toBe(false);
	});

	it("Remove item", () => {
		expect(PlayerController.hasItem("Magical Stone")).toBe(true);

		PlayerController.removeItemByName("Magical Stone");

		expect(PlayerController.hasItem("Magical Stone")).toBe(false);
	});
});
