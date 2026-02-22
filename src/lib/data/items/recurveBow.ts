import type { CraftItem } from "$lib/types/item";

const recurveBow = {
	type: "craft",
	id: "recurvebow",
	name: "Recurve Bow",
	iconPath: "/items/bow5.jpg",
	iconClass: "",
	unique: false,
	description: "Small but usable on horseback.",
	quality: "common",
	components: [],
	resourceCosts: [{ resource: "Wood", amount: 2 }],
} satisfies CraftItem;

export default recurveBow;