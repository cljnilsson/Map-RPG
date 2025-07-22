import type { CustomMap, WorldMap, CityMap, BuildingMap } from "$lib/types/mapTypes";
import type { VendorNPC } from "$lib/types/npc";
import type { LootableQuestGameObject } from "./types/gameObject";
import { getItem } from "$lib/data/items";

const wo: WorldMap = {
	name: "Westeros",
	type: "world",
	imagePath: "/map1.jpg"
};

const winterfellO: CityMap = {
	name: "Winterfell",
	type: "city",
	imagePath: "/map3.webp",
	unlocked: true,
	owned: true
};

const kingsLandingO: CityMap = {
	name: "King's Landing",
	type: "city",
	imagePath: "/map2.webp",
	unlocked: true,
	owned: false
};

const starkKeepO: BuildingMap = {
	name: "Winterfeel Keep",
	type: "building",
	imagePath: "starkKeep.webp",
	unlocked: true,
	npcs: [],
	upgrades: []
};

export const world: CustomMap = {
	map: wo,
	previous: null,
	contains: [
		{ map: kingsLandingO, clickBox: { x: 715, y: 2130, originalX: 715, originalY: 2130, width: 100, height: 80, rotation: 0 } },
		{ map: winterfellO, clickBox: { x: 500, y: 1000, originalX: 500, originalY: 1000, width: 120, height: 90, rotation: 0 } }
	],
	objects: [],
	npcs: []
};

export const winterfell: CustomMap = {
	map: winterfellO,
	previous: world,
	contains: [{ map: starkKeepO, clickBox: { x: 830, y: 110, originalX: 830, originalY: 110, width: 400, height: 220, rotation: 50 } }],
	objects: [],
	npcs: []
};

export const kingsLanding: CustomMap = {
	map: kingsLandingO,
	previous: world,
	contains: [],
	objects: [],
	npcs: []
};

export const starkKeep: CustomMap = {
	map: starkKeepO,
	previous: winterfell,
	contains: [],
	objects: [
		{
			name: "Mysterious scroll",
			img: "/scroll.png",
			position: { x: 530, y: 280 },
			conditions: [],
			pickedUpItem: {...getItem("test-quest-item1"), amount: 1},
			quests: [
				{
					id: "2",
					title: "Test Quest2",
					description: "This is a test quest description.",
					progressGoals: ["Talk to the NPC", "Complete the task"],
					progress: 0,
					rewardResources: [{ name: "Gold", amount: 3, icon: "/icons/coin3.png" }],
					rewardMisc: "",
					rewardItems: [],
					mainQuest: false,
					status: "active",
					dialogue: []
				}
			]
		} as LootableQuestGameObject
	],
	npcs: [
		{
			name: "Guard Jenax",
			img: "/guard.png",
			position: { x: 730, y: 380 },
			conditions: [],
			items: [
				getItem("test-helm1"),
				getItem("test-armor1"),
				getItem("test-sword1"),
			],
			health: 100,
			maxHealth: 100
		} as VendorNPC
	]
};

export const maps: CustomMap[] = [world, winterfell, kingsLanding, starkKeep];
