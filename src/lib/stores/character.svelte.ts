import type { Character } from "$lib/types/character";
import type { InventoryItem } from "$lib/types/item";

const Store = $state<{
	character: Character | null;
	inventory: InventoryItem[];
	location: string;
}>({
	inventory: [],
	character: null,
	location: "Forest",
});

export default Store;