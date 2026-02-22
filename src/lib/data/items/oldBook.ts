import type { UsableItem } from "$lib/types/item";
import { createBookItem } from "$lib/controller/factories/usableItem";

const oldBook = createBookItem(
	{
		type: "item",
		id: "old-book",
		name: "Old Book",
		iconPath: "/items/book7.jpg",
		iconClass: "",
		unique: true,
		description: "Old but intact.",
		quality: "rare",
	},
	["<p>Test</p>", "<p>Test2</p>"],
) satisfies UsableItem;

export default oldBook;