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

type Item = RegularItem | VendorItem | UsableItem;

export type { Item, RegularItem, VendorItem, UsableItem, BaseItem };
