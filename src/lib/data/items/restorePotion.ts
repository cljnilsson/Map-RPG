import type { UsableItem } from "$lib/types/item";
import { PlayerController } from "$lib/controller/character.svelte";

const restorePotion = {
	type: "usable",
	id: "reset-potion",
	name: "Restoration Potion",
	iconPath: "/items/potion6.png",
	iconClass: "",
	unique: false,
	description: "Removes all conditions from you.",
	quality: "rare",
	consumable: true,
	conditions: () => true,
	onUse: () => {
		PlayerController.conditions = [];
		return true;
	}
} satisfies UsableItem;

export default restorePotion;
