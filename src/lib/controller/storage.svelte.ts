//import type { Character } from "$lib/types/character";
import type { Item, VendorItem, InventoryItem } from "$lib/types/item";
import { LogController } from "$lib/controller/logs.svelte";
import { addItem } from "$lib/api/storage.remote";

const storageState: { storage: InventoryItem[] } = $state({ storage: [] });

export default class StorageController {
	// ---------------
	// Variables
	// ---------------
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get inventory() {
		return storageState.storage;
	}

	public static set inventory(v: InventoryItem[]) {
		storageState.storage = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static async addItem({ item, amount }: InventoryItem, cityId: number): Promise<boolean> {
		if (StorageController.inventory.length < StorageController.inventorySize) {
			// TODO, check if item.id exists in client database
			const getMyStorage = await addItem({
				cityId: cityId,
				key: item.id,
				amount
			});

			if(getMyStorage) {
				StorageController.inventory = [...StorageController.inventory, { item, amount }];
				const itemLabel = amount > 1 ? `${amount}x ${item.name}` : `a ${item.name}`;
				LogController.newLog(`You received ${itemLabel}.`, "info");
				return true;
			}

			return false;
		}

		LogController.newLog("You need more inventory space.", "warning");
		return false;
	}

	public static hasItems(items: InventoryItem[]): boolean {
		return items.every(({ item, amount }) =>
			StorageController.inventory.some((slot) => slot.item.name === item.name && slot.amount >= amount)
		);
	}

	public static hasItem(name: string): boolean;
	public static hasItem(name: string, amount: number): boolean;
	public static hasItem(name: string, amount?: number): boolean {
		if (amount === undefined) {
			return StorageController.inventory.some((slot) => slot.item.name === name);
		}

		const item = StorageController.inventory.find((slot) => slot.item.name === name);
		return item !== undefined && item.amount >= amount;
	}

	public static removeItemByName(name: string) {
		const itemIndex = StorageController.inventory.findIndex((slot) => slot.item.name === name);

		if (itemIndex !== -1) {
			const removedItem = StorageController.inventory[itemIndex];
			StorageController.inventory = StorageController.inventory.filter((_, index) => index !== itemIndex);

			LogController.newLog(`You lost ${removedItem.item.name}.`, "info");
		} else {
			console.error("Trying to remove item that does not exist");
		}
	}
}
