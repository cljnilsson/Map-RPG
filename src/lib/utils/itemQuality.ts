import type { Item } from "$lib/types/item";

export function q2c(i: Item): string {
	if (i?.quality === "common") {
		return "#FFFFFF"; // White
	} else if (i?.quality === "rare") {
		return "#0070dd"; // Blue
	} else if (i?.quality === "epic") {
		return "#a335ee"; // Purple
	}
	return ""; // Default empty string
}
