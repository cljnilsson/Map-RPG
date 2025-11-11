import healthPotion from "$lib/data/items/healthPotion";
import resetPotion from "$lib/data/items/restorePotion";
import oldBook from "$lib/data/items/oldBook";
import tempItems from "$lib/data/items/testItems";
import type { Item } from "$lib/types/item";

// Types are either Item, VendorItem or UsableItem all of which are subtypes of Item if not Item itself
const itemRegistry = {
	"health-potion": () => ({ ...healthPotion }),
	"reset-potion": () => ({ ...resetPotion }),
	"old-book": () => ({ ...oldBook }),
	"test-sword1": () => ({ ...tempItems[0] }),
	"test-armor1": () => ({ ...tempItems[1] }),
	"test-helm1": () => ({ ...tempItems[2] }),
	"test-quest-item1": () => ({ ...tempItems[3] }),
	"test-item-1": () => ({ ...tempItems[4] }),
	"test-item-2": () => ({ ...tempItems[5] }),
	"test-item-3": () => ({ ...tempItems[6] }),
	"test-chest-key1": () => ({ ...tempItems[7] })
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(itemRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Item ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

export type ItemId = keyof typeof itemRegistry;

export function getItem<T extends ItemId>(id: T) {
	return itemRegistry[id]();
}

export function safeGetItem(id: string): Item | undefined {
	console.log(id);
	if (id in itemRegistry) {
		return itemRegistry[id as ItemId]();
	}
	return undefined;
}

export function getAllItems(): Item[] {
	const items: Item[] = [];

	for (const item of Object.values(itemRegistry)) {
		items.push(item());
	}

	return items;
}