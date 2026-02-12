import type { CraftItem } from "$lib/types/item";

const bow = {
	type: "craft",
	id: "bow",
	name: "Bow",
	iconPath: "/items/bow2.jpg",
	iconClass: "",
	unique: false,
	description: "Simple, cheap.. still deadly.",
	quality: "common",
	components: []
} satisfies CraftItem;

export default bow;
