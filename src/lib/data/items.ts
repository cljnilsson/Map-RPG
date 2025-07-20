import type { VendorItem, Item } from "$lib/types/item";
import healthPotion from "$lib/data/items/healthPotion";
import oldBook from "$lib/data/items/oldBook";

export const itemRegistry: Record<string, () => Item> = {
	"health-potion": () => ({ ...healthPotion }),
	"old-book": () => ({ ...oldBook })
};
