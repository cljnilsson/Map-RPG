type BaseItem = {
	id: string;
	name: string;
	iconClass: string;
	iconPath: string;
	quality: "common" | "uncommon" | "rare" | "epic" | "legendary";
	description: string;
	unique: boolean;
};

type RegularItem = BaseItem & {
	type: "item";
};

export type Quality = "Poor" | "Good" | "Excellent" | "Perfect";
type CraftItem = BaseItem & {
	type: "craft";
	components: {
		item: string; // refers to itemId, ideally would want a direct item object reference but that would only work at runtime. Still, something to consider in the future.
		quantity: number;
		requiredQuality: Quality | false;
	}[];
	resourceCosts: {
		resource: string;
		amount: number;
	}[];
};

type VendorItem = BaseItem & {
	type: "vendor";
	price: {
		gold: number;
		silver: number;
		copper: number;
	};
};

type UsableItem = BaseItem & {
	type: "usable";
	consumable: boolean;
	conditions: () => boolean;
	onUse: () => boolean;
};

type Item = RegularItem | VendorItem | UsableItem | CraftItem;

type InventoryItem<T extends Item = Item> = {
	item: T;
	amount: number;
};

export type { Item, RegularItem, VendorItem, UsableItem, BaseItem, InventoryItem, CraftItem };
