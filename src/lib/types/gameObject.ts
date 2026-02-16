import type { Quest } from "$lib/types/quest";
import type { InventoryItem } from "$lib/types/item";

type GameObject = {
	id: string;
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // temp for future debuffs / statuses
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

type ContainerGameObject = GameObject & {
	contains: InventoryItem[];
	itemsTaken: InventoryItem[];
	requiredItems: InventoryItem[];
	requiredStat: { amount: number; stat: "str" | "int" | "vit" | "char" | "dex"; menuText: string }[]; // stat to be beat, it's an OR not AND
	failedRollAlready: boolean; // if required stat open has already been attempted
	onOpenAttemptLogMessage?: string;
	onOpenSuccessLogMessage?: string;
	onOpenFailMessage?: string;
};

export type { GameObject, LootableGameObject, QuestGameObject, LootableQuestGameObject, ContainerGameObject };
