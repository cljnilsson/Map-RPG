import type { CraftItem } from "$lib/types/item";

const masterworkLongbow = {
	type: "craft",
	id: "masterwork-longbow",
	name: "Masterwork Longbow",
	iconPath: "/items/bow4.jpg",
	iconClass: "",
	unique: false,
	description: "Elegant, sturdy, effective.. art.",
	quality: "common",
	components: [],
	resourceCosts: [],
} satisfies CraftItem;

export default masterworkLongbow;