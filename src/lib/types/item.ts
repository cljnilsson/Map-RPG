type Item = {
    id: string; // Unique identifier for the item
    name: string;
    iconClass: string;
    iconPath: string;
    quality: "common" | "uncommon" | "rare" | "epic" | "legendary";
    description: string;
    unique: boolean;
};

type VendorItem = Item & {
    price: {
        gold: number;
        silver: number;
        copper: number;
    };
}

type InventoryItem = Item & {
    amount: number;
}

type UsableInventoryItem = InventoryItem & {
    onUse: () => boolean;
    conditions: () => boolean;
    consumable: boolean;
}

type UsableItem = Item & {
    onUse: () => boolean;
    conditions: () => boolean;
    consumable: boolean;
}

export type { Item, VendorItem, InventoryItem, UsableInventoryItem, UsableItem };