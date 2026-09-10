import { describe, expect, it } from "vitest";
import { q2c, q2g, qualityGemCount } from "#lib/utils/itemQuality.js";
import type { Item } from "#lib/types/item.js";

function itemWithQuality(quality: Item["quality"]): Item {
	return { quality } as Item;
}

describe("item quality presentation", () => {
	it.each([
		["common", 0],
		["uncommon", 1],
		["rare", 2],
		["epic", 3],
		["legendary", 4],
	] as const)("maps %s items to %i active gems", (quality, count) => {
		expect(qualityGemCount(itemWithQuality(quality))).toBe(count);
	});

	it("uses orange for legendary items", () => {
		expect(q2c(itemWithQuality("legendary"))).toBe("#ff8000");
		expect(q2g(itemWithQuality("legendary"))).toBe("/gems/goldGem.png");
	});
});