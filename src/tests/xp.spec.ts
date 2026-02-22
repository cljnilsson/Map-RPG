import { describe, it, expect } from "vitest";
import { getXPForLevel, xpToNextLevel } from "$lib/utils/xp";

describe("XP requirements", () => {
	it("gets the XP to specific levels", () => {
		expect(getXPForLevel(90)).toEqual(5346332);
		expect(getXPForLevel(33)).toEqual(18247);
		expect(getXPForLevel(10)).toEqual(1154);
	});

	it("gets the remaining XP to a next level", () => {
		expect(xpToNextLevel(1, 0)).toEqual(83);
		expect(xpToNextLevel(4, 100)).toEqual(388 - 100);
	});
});