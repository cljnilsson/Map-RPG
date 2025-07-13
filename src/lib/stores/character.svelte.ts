import type { Character } from "$lib/types/character";
import type { InventoryItem } from "$lib/types/item";

const Store = $state<{
	character: Character;
	inventory: InventoryItem[];
	location: string;
}>({
	inventory: [
		{
			name: "Box of Eggs",
			iconPath: "",
			iconClass: "bi bi-box",
			amount: 1,
			unique: false,
			description: "A box containing fresh eggs.",
			quality: "rare"
		},
		{
			name: "Blacksmith's Hammer",
			iconPath: "",
			iconClass: "bi bi-hammer",
			unique: true,
			amount: 1,
			description: "A box containing fresh eggs.",
			quality: "common"
		},
		{
			name: "Magical Stone",
			iconPath: "/items/stone3.jpg",
			iconClass: "",
			unique: false,
			amount: 3,
			description: "An unknown black stone with a strange glow.",
			quality: "epic"
		}
	],
	character: {
		stats: { str: 5, int: 8, vit: 10, char: 7, dex: 5 },
		name: "Alice",
		health: 25,
		maxHealth: 100,
		age: 22,
		gender: "Female",
		race: "Human",
		conditions: [],
		xp: 10,
		level: 1,
		money: {
			gold: 1,
			silver: 2,
			copper: 3
		}
	},
	location: "Forest"
});

export default Store;
