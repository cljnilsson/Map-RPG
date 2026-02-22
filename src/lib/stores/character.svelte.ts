import type { Character } from "$lib/types/character";
import type { InventoryItem } from "$lib/types/item";

const Store = $state<{
	character: Character;
	inventory: InventoryItem[];
	location: string;
}>({
	inventory: [],
	character: {
		id: 1,
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
			copper: 3,
		},
	},
	location: "Forest",
});

export default Store;