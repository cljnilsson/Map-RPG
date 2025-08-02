import type { GameObject, LootableGameObject, LootableQuestGameObject, ContainerGameObject } from "$lib/types/gameObject";
import { getQuest } from "$lib/data/quests";
import { getItem } from "$lib/data/items";

const gameobjectRegistry = {
	"test-scroll-1": () =>
		({
			id: "test-scroll-1",
			name: "Mysterious scroll",
			img: "/scroll.png",
			position: { x: 530, y: 280 },
			conditions: [],
			pickedUpItem: { item: getItem("test-quest-item1"), amount: 1 },
			quests: [getQuest("test-quest-2")]
		}) as LootableQuestGameObject,
	"test-chest-1": () =>
		({
			id: "test-chest-1",
			name: "Treasure Chest",
			img: "/chest.png",
			position: { x: 1100, y: 500 },
			conditions: [],
			itemsTaken: [],
			contains: [{ item: getItem("test-quest-item1"), amount: 1 }]
		}) as ContainerGameObject
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(gameobjectRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Quest ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

export type GameobjectId = keyof typeof gameobjectRegistry;

export function getGameobject<T extends GameobjectId>(id: T) {
	return gameobjectRegistry[id]();
}
