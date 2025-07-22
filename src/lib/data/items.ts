import type { VendorItem, Item } from "$lib/types/item";
import healthPotion from "$lib/data/items/healthPotion";
import oldBook from "$lib/data/items/oldBook";

const itemRegistry = {
	"health-potion": () => ({ ...healthPotion }),
	"old-book": () => ({ ...oldBook }),
	"test-sword1": () => ({
		id: "test-sword1",
		name: "Sword",
		iconClass: "",
		iconPath: "/items/sword4.jpg",
		quality: "rare",
		description: "A common sword, sharp and reliable.",
		unique: false,
		price: {
			gold: 0,
			silver: 5,
			copper: 0
		}
	}) as VendorItem,
	"test-armor1": () => (
	{
		id: "test-armor1",
		name: "Armor",
		iconClass: "",
		iconPath: "/items/armor.png",
		quality: "common",
		description: "Heavy armor",
		unique: false,
		price: {
			gold: 1,
			silver: 0,
			copper: 0
		}
	}) as VendorItem,
	"test-helm1": () => ({
		id: "test-helm1",
		name: "Helmet",
		iconClass: "",
		iconPath: "/items/helmet4.jpg",
		quality: "common",
		description: "A knight's helmet in good condition",
		unique: false,
		price: {
			gold: 0,
			silver: 4,
			copper: 0
		}
	}) as VendorItem,
	"test-quest-item1": () => ({
		id: "test-quest-item1",
		name: "Mysterious scroll",
		iconClass: "",
		iconPath: "/items/scroll.jpg",
		quality: "common",
		description: "A scroll with mysterious symbols.",
		unique: true
	}) as Item,
	"test-item-1": () => ({
		id: "test-item-1",
		name: "Box of Eggs",
		iconPath: "",
		iconClass: "bi bi-box",
		unique: false,
		description: "A box containing fresh eggs.",
		quality: "rare"
	}) as Item,
	"test-item-2": () => ({
		id: "test-item-2",
		name: "Blacksmith's Hammer",
		iconPath: "",
		iconClass: "bi bi-hammer",
		unique: true,
		description: "A box containing fresh eggs.",
		quality: "common"
	}) as Item,
	"test-item-3": () => ({
		id: "test-item-3",
		name: "Magical Stone",
		iconPath: "/items/stone3.jpg",
		iconClass: "",
		unique: false,
		description: "An unknown black stone with a strange glow.",
		quality: "epic"
	}) as Item,
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for(const [key, value] of Object.entries(itemRegistry)) {
	if(key === value().id) {
		continue;
	} else {
		throw new Error(`Item ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

export type ItemId = keyof typeof itemRegistry;

export function getItem<T extends ItemId>(id: T) {
	return itemRegistry[id]();
}