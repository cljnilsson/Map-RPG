import { describe, it, expect } from "vitest";
import { costToNextLevel } from "$lib/utils/cost";

describe("Cost requirements", () => {
	it("gets the cost to specific levels", () => {
		expect(costToNextLevel(100, 1)).toEqual(200);
		expect(costToNextLevel(100, 5)).toEqual(725);
		expect(costToNextLevel(100, 10)).toEqual(3630);
		expect(costToNextLevel(100, 20)).toEqual(90935);
	});
});