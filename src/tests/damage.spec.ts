import { describe, it, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

//import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
import type {NPC} from "$lib/types/npc";
import {PlayerController} from "$lib/controller/character.svelte";
import PlayerStore from "$lib/stores/character.svelte";

describe("Damage", () => {
	it("Player attacks NPC", () => {
		const toDeal = 3;
		const hp = 30;
		const targetDummy: NPC = {
			health: hp,
			maxHealth: hp,
			name: "Test Dummy",
			img: "",
			position: { x: 0, y: 0 },
			conditions: []
		}

		expect(targetDummy.health).toBe(hp);

		PlayerController.attack(toDeal, "str", targetDummy);

		expect(targetDummy.health).toBeLessThan(hp);
	});

	it("Player takes damage from unknown source", () => {
		const toDeal = 2;
		const startingHP = PlayerStore.character.health;

		PlayerController.damage(toDeal);

		expect(PlayerStore.character.health).toBe(startingHP - toDeal);
	});
});