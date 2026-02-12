import type { CraftItem } from "$lib/types/item";

const reinforcedShield = {
	type: "craft",
	id: "reinforcedShield",
	name: "Reinforced Shield",
	iconPath: "/items/shield1.jpg",
	iconClass: "",
	unique: false,
	description: "Stronger.",
	quality: "rare",
	components: [
		{ item: "woodenShield", quantity: 1, requiredQuality: false },
		{ item: "iron-bar", quantity: 2, requiredQuality: false }
	]
} satisfies CraftItem;

export default reinforcedShield;
