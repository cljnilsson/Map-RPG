import type { GameObject, LootableGameObject, QuestGameObject, LootableQuestGameObject, ContainerGameObject } from "$lib/types/gameObject";


function isLootableGameObject(obj: GameObject): obj is LootableGameObject {
	return "pickedUpItem" in obj && !("quests" in obj);
}

function isQuestGameObject(obj: GameObject): obj is QuestGameObject {
	return "quests" in obj && !("pickedUpItem" in obj);
}

function isLootableQuestGameObject(obj: GameObject): obj is LootableQuestGameObject {
	return "pickedUpItem" in obj && "quests" in obj;
}

function isBaseGameObject(obj: GameObject): obj is GameObject {
	return !("pickedUpItem" in obj) && !("quests" in obj);
}

function isContainerGameObject(obj: GameObject): obj is ContainerGameObject {
	return "contains" in obj && Array.isArray(obj.contains);
}

export { isLootableGameObject, isQuestGameObject, isLootableQuestGameObject, isBaseGameObject, isContainerGameObject};