import type { Item, VendorItem, InventoryItem, UsableItem } from "$lib/types/item";

function isVendorItem(item: Item): item is VendorItem {
	return (
		typeof (item as VendorItem).price?.gold === "number" &&
		typeof (item as VendorItem).price?.silver === "number" &&
		typeof (item as VendorItem).price?.copper === "number"
	);
}

function isUsableItem(item: Item): item is UsableItem {
	const maybe = item as UsableItem;
	return (
		typeof maybe.onUse === "function" &&
		typeof maybe.conditions === "function" &&
		typeof maybe.consumable === "boolean" &&
		typeof (maybe as Partial<InventoryItem>).amount !== "number"
	);
}

export { isVendorItem, isUsableItem };
