import type { CraftItem } from "$lib/types/item";

const ironBar = {
	type: "craft",
	id: "iron-bar",
	name: "Iron Bar",
	iconPath: "/items/handle.jpg",
	iconClass: "",
	unique: false,
	description: "Iron shaped into a workable bar.",
	quality: "common",
	components: [],
	resourceCosts: [{ resource: "Iron", amount: 5 }],
} satisfies CraftItem;

export default ironBar;