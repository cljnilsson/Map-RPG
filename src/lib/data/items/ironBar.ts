import type { RegularItem } from "$lib/types/item";

const ironBar = {
	type: "item",
	id: "iron-bar",
	name: "Iron Bar",
	iconPath: "/items/handle.jpg",
	iconClass: "",
	unique: false,
	description: "Iron shaped into a workable bar.",
	quality: "common"
} satisfies RegularItem;

export default ironBar;
