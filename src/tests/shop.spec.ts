import { describe, it, expect, vi } from "vitest";
import type { VendorItem } from "$lib/types/item";
//import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
import { PlayerController } from "$lib/controller/character.svelte";

vi.mock("$lib/stores/character.svelte", () => {
	return {
		default: {
			inventory: [],
			character: {
				id: "1",
				stats: { str: 6, int: 6, vit: 6, char: 6, dex: 6 },
				health: 15,
				maxHealth: 15,
				name: "Test",
				race: "Human",
				age: 25,
				imagePath: "/char.jpg",
				gender: "Unknown",
				xp: 0,
				level: 1,
				conditions: [],
				money: {
					gold: 1,
					silver: 2,
					copper: 3,
				},
			},
			location: "Forest",
		},
	};
});

describe("Inventory", () => {
	it("Vendor price checks", () => {
		// At the time of writing the player starts with 123 copper
		expect(PlayerController.canAfford(0, 0, 1)).toBe(true);
		expect(PlayerController.canAfford(0, 0, 2)).toBe(false);
	});

	it("Buying item", () => {
		const item: VendorItem = {
			type: "vendor",
			id: "t-sword-1",
			name: "Sword",
			iconClass: "",
			iconPath: "/items/sword4.jpg",
			quality: "rare",
			unique: false,
			description: "A common sword, sharp and reliable.",
			price: {
				gold: 0,
				silver: 5,
				copper: 0,
			},
		};
		const startingMoney = PlayerController.money; // 3c 2s 1g at the time of writing
		const startingMoneyInCopper = PlayerController.moneyToCopper(
			startingMoney.copper,
			startingMoney.silver,
			startingMoney.gold,
		);

		PlayerController.buyItem(item);

		const remainingMoneyInCopper = PlayerController.moneyToCopper(
			PlayerController.money.copper,
			PlayerController.money.silver,
			PlayerController.money.gold,
		);

		expect(PlayerController.money.copper).toEqual(3);
		expect(PlayerController.money.silver).toEqual(7);
		expect(PlayerController.money.gold).toEqual(0);
		expect(remainingMoneyInCopper).toEqual(startingMoneyInCopper - 50); // 5 silver = 50 copper
		expect(PlayerController.inventory.length).toBeGreaterThan(0);
		expect(PlayerController.inventory.some((i) => i.item.name === item.name && i.amount === 1)).toBe(true);
	});
});