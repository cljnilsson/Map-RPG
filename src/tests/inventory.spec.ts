import { describe, it, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

//import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
import {PlayerController} from "$lib/controller/character.svelte";

describe("Inventory", () => {
	it("Has item", () => {
		// At the time of writing the player has 3 magical stones
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

/*test("xo", async () => {
	render(InventoryWindow);
});*/