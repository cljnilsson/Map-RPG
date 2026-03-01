import { describe, it, expect, vi } from "vitest";

import type { NPC } from "$lib/types/npc";
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
			conditions: [],
		};

		expect(targetDummy.health).toBe(hp);

		PlayerController.attack(toDeal, "str", targetDummy);

		expect(targetDummy.health).toBeLessThan(hp);
	});

	it("Player takes damage from unknown source", () => {
		const toDeal = 2;
		const startingHP = PlayerController.health;

		PlayerController.damage(toDeal);

		expect(PlayerController.health).toBe(startingHP - toDeal);
	});
});