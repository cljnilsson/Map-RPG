import type { Character } from "$lib/types/character";
import type { InventoryItem, UsableInventoryItem } from "$lib/types/item";
import { createBookItem } from "$lib/controller/factories/usableItem";
import CharacterStore from "$lib/stores/character.svelte";

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
		},
		{
			name: "Lesser Health Potion",
			iconPath: "/items/potion5.png",
			iconClass: "",
			unique: false,
			amount: 3,
			description: "Restores 10 HP on use.",
			quality: "common",
			conditions: () => true,
			onUse: () => {
				console.log("You used a Lesser Health Potion.");
				if(CharacterStore.character.health >= CharacterStore.character.maxHealth) {
					return false;
				}
				CharacterStore.character.health += 10;
				return true;
			},
			consumable: true
		} as UsableInventoryItem,
		createBookItem({
			name: "Old Book",
			iconPath: "/items/book7.jpg",
			iconClass: "",
			unique: true,
			description: "Old but intact.",
			quality: "rare"
		}, 1, ["<p>Test</p>", "<p>Test2</p>"])
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
