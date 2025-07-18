import type { Item, UsableInventoryItem } from "$lib/types/item";
import BookStore from "$lib/stores/book.svelte";
import { LogController } from "$lib/controller/logs.svelte";

export function createBookItem(item: Item, amount: number, pages: string[]): UsableInventoryItem {
	if (pages.length === 0) {
		console.warn("This book has no pages.");
	} else if (pages.some((page) => page.length === 0)) {
		console.warn("This book has empty pages.");
	}

	function validate() {
		return true;
	}

	return {
		...item,
		amount,
		consumable: false,
		conditions: validate,
		onUse: () => {
			if (validate()) {
				console.log(pages);
				BookStore.visible = true;
				BookStore.currentPage = 0;
				BookStore.currentBook = pages;
				return true;
			}

			console.warn("You cannot use this item right now.");
			LogController.newLog("You cannot use this item right now.", "warning");
			return false;
		}
	};
}
