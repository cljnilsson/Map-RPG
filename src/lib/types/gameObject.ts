import type { Quest } from "$lib/types/quest";
import type { InventoryItem } from "$lib/types/item";

type GameObject = {
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // Also temp
};

type LootableGameObject = GameObject & {
	pickedUpItem: InventoryItem;
};

type QuestGameObject = GameObject & {
	quests: Quest[];
};

type LootableQuestGameObject = QuestGameObject & {
	pickedUpItem: InventoryItem;
};

export type { GameObject, LootableGameObject, QuestGameObject, LootableQuestGameObject };
