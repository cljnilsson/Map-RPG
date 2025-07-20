import type { VendorItem, Item } from "$lib/types/item";
import healthPotion from "$lib/data/items/healthPotion";
import oldBook from "$lib/data/items/oldBook";

const itemRegistry = {
	"health-potion": () => ({ ...healthPotion }),
	"old-book": () => ({ ...oldBook })
} as const;

type ItemId = keyof typeof itemRegistry;

export function getItem<T extends ItemId>(id: T): Item {
	return { ...itemRegistry[id]() };
}