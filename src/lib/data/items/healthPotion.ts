import type { UsableItem } from "$lib/types/item";
import { PlayerController } from "$lib/controller/character.svelte";

const lesserHealthPotion: UsableItem = {
	id: "health-potion",
	name: "Lesser Health Potion",
	iconPath: "/items/potion5.png",
	iconClass: "",
	unique: false,
	description: "Restores 10 HP on use.",
	quality: "common",
	consumable: true,
	conditions: () => true,
	onUse: () => {
		if (PlayerController.health >= PlayerController.maxHealth) return false; // Move this into conditions
		PlayerController.health += 10;
		return true;
	}
};

export default lesserHealthPotion;
