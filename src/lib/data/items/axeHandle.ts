import type { CraftItem } from "$lib/types/item";

const axeHandle = {
	type: "craft",
	id: "axe-handle",
	name: "Axe Handle",
	iconPath: "/items/handle.jpg",
	iconClass: "",
	unique: false,
	description: "Simple but sturdy, component of an axe.",
	quality: "common",
	components: []
} satisfies CraftItem;

export default axeHandle;
