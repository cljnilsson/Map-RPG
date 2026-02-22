import type { CraftItem } from "$lib/types/item";

const woodenShield = {
	type: "craft",
	id: "woodenShield",
	name: "Wooden Shield",
	iconPath: "/items/shield3.jpg",
	iconClass: "",
	unique: false,
	description: "Simple, cheap.. a lot better than nothing.",
	quality: "common",
	components: [],
	resourceCosts: [{ resource: "Wood", amount: 2 }],
} satisfies CraftItem;

export default woodenShield;