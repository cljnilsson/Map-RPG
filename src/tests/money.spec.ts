import { describe, it, expect } from "vitest";
import {PlayerController} from "$lib/controller/character.svelte";

describe("Money", () => {
	it("Copper to visual", () => {
		expect(PlayerController.copperToMoney(1000)).toEqual({gold: 10, silver: 0, copper: 0});
		expect(PlayerController.copperToMoney(1051)).toEqual({gold: 10, silver: 5, copper: 1});
	});

	it("Visual to copper", () => {
		expect(PlayerController.moneyToCopper(0, 0, 10)).toEqual(1000);
		expect(PlayerController.moneyToCopper(1, 5, 10)).toEqual(1051);
	});
});