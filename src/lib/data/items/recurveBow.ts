import type { CraftItem } from "$lib/types/item";

const recurveBow = {
	type: "craft",
	id: "recurvebow",
	name: "Recurve Bow",
	iconPath: "/items/bow4.jpg",
	iconClass: "",
	unique: false,
	description: "Small but usable on horseback.",
	quality: "common",
	components: []
} satisfies CraftItem;

export default recurveBow;
