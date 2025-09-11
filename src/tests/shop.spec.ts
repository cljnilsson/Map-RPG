import { describe, it, expect } from "vitest";
import type { VendorItem } from "$lib/types/item";

//import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
import { PlayerController } from "$lib/controller/character.svelte";

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
				copper: 0
			}
		};
		const startingMoney = PlayerController.money; // 3c 2s 1g at the time of writing
		const startingMoneyInCopper = PlayerController.moneyToCopper(startingMoney.copper, startingMoney.silver, startingMoney.gold);

		PlayerController.buyItem(item);

		const remainingMoneyInCopper = PlayerController.moneyToCopper(
			PlayerController.money.copper,
			PlayerController.money.silver,
			PlayerController.money.gold
		);

		expect(PlayerController.money.copper).toEqual(3);
		expect(PlayerController.money.silver).toEqual(7);
		expect(PlayerController.money.gold).toEqual(0);
		expect(remainingMoneyInCopper).toEqual(startingMoneyInCopper - 50); // 5 silver = 50 copper
		expect(PlayerController.inventory.length).toBeGreaterThan(0);
		expect(PlayerController.inventory.some(i => i.item.name === item.name && i.amount === 1)).toBe(true);
	});
});