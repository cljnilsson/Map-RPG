type Item = {
    name: string;
    iconClass: string;
    iconPath: string;
    quality: "common" | "uncommon" | "rare" | "epic" | "legendary";
    description: string;
};

type InventoryItem = Item & {
    amount: number;
}

export type { Item, InventoryItem };