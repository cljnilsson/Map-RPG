import { describe, it, expect, vi } from "vitest";
import { PlayerController } from "$lib/controller/character.svelte";

vi.mock("$lib/api/windows.remote.ts", () => {
	return {
		getWindowPositionsByCharacter: vi.fn(() => ({
			success: true,
			positions: [],
		})),
		updateWindowPositionsByCharacter: vi.fn(() => ({ success: true })),
	};
});

vi.mock("$lib/api/character.remote.ts", () => {
	return {
		getAllCharacters: vi.fn(() => []),
		createCharacter: vi.fn(() => true),
		saveCharacter: vi.fn(() => true),
	};
});

vi.mock("$lib/api/quests.remote.ts", () => {
	return {
		updateOneQuest: vi.fn(() => ({ success: true, failedQuests: [] })),
	};
});

describe("Money", () => {
	it("Copper to visual", () => {
		expect(PlayerController.copperToMoney(1000)).toEqual({ gold: 10, silver: 0, copper: 0 });
		expect(PlayerController.copperToMoney(1051)).toEqual({ gold: 10, silver: 5, copper: 1 });
	});

	it("Visual to copper", () => {
		expect(PlayerController.moneyToCopper(0, 0, 10)).toEqual(1000);
		expect(PlayerController.moneyToCopper(1, 5, 10)).toEqual(1051);
	});
});