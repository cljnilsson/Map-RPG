import type { Item } from "#lib/types/item.js";

const gemCountByQuality: Record<Item["quality"], number> = {
	common: 0,
	uncommon: 1,
	rare: 2,
	epic: 3,
	legendary: 4,
};

export function q2c(i: Item): string {
	if (i?.quality === "common") {
		return "#FFFFFF"; // White
	} else if (i?.quality === "uncommon") {
		return "#1eff00"; // Green
	} else if (i?.quality === "rare") {
		return "#0070dd"; // Blue
	} else if (i?.quality === "epic") {
		return "#a335ee"; // Purple
	} else if (i?.quality === "legendary") {
		return "#ff8000"; // Orange
	}
	return ""; // Default empty string
}

export function qualityGemCount(i: Item): number {
	return gemCountByQuality[i?.quality] ?? 0;
}

export function q2g(i: Item): string {
	if (i?.quality === "uncommon") {
		return "/gems/greenGem.png"; // Green
	} else if (i?.quality === "rare") {
		return "/gems/blueGem.png"; // Blue
	} else if (i?.quality === "epic") {
		return "/gems/purpleGem.png"; // Purple
	} else if (i?.quality === "legendary") {
		return "/gems/goldGem.png"; // Legendary
	}
	return ""; // Default empty string
}