import type { VendorItem, Item } from "$lib/types/item";
import healthPotion from "$lib/data/items/healthPotion";
import oldBook from "$lib/data/items/oldBook";

const itemRegistry = {
	"health-potion": () => ({ ...healthPotion }),
	"old-book": () => ({ ...oldBook })
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for(const [key, value] of Object.entries(itemRegistry)) {
	if(key === value().id) {
		continue;
	} else {
		throw new Error(`Item ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

type ItemId = keyof typeof itemRegistry;

export function getItem<T extends ItemId>(id: T): Item {
	return { ...itemRegistry[id]() };
}