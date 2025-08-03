import type { Item, VendorItem } from "$lib/types/item";

const items = [
	{
		type: "vendor",
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
	} satisfies VendorItem,
	{
		type: "vendor",
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
	} satisfies VendorItem,
	{
		type: "vendor",
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
	} satisfies VendorItem,
	{
		type: "item",
		id: "test-quest-item1",
		name: "Mysterious scroll",
		iconClass: "",
		iconPath: "/items/scroll.jpg",
		quality: "common",
		description: "A scroll with mysterious symbols.",
		unique: true
	} satisfies Item,
	{
		type: "item",
		id: "test-item-1",
		name: "Box of Eggs",
		iconPath: "",
		iconClass: "bi bi-box",
		unique: false,
		description: "A box containing fresh eggs.",
		quality: "rare"
	} satisfies Item,
	{
		type: "item",
		id: "test-item-2",
		name: "Blacksmith's Hammer",
		iconPath: "",
		iconClass: "bi bi-hammer",
		unique: true,
		description: "A box containing fresh eggs.",
		quality: "common"
	} satisfies Item,
	{
		type: "item",
		id: "test-item-3",
		name: "Magical Stone",
		iconPath: "/items/stone3.jpg",
		iconClass: "",
		unique: false,
		description: "An unknown black stone with a strange glow.",
		quality: "epic"
	} satisfies Item,
	{
		type: "item",
		id: "test-chest-key1",
		name: "Rusty Key",
		iconPath: "/items/key.png",
		iconClass: "",
		unique: true,
		description: "A rusty key that looks like it might open something.",
		quality: "common"
	} satisfies Item
] as const;

export default items;
