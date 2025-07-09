import type { CustomMap, WorldMap, CityMap, BuildingMap } from "$lib/types/mapTypes";
import type { QuestGiverNPC, VendorNPC } from "$lib/types/npc";
import type { LootableQuestGameObject } from "./types/gameObject";

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
			pickedUpItem: {
				name: "Mysterious scroll",
				iconClass: "",
				iconPath: "/items/scroll.jpg",
				quality: "common",
				description: "A scroll with mysterious symbols.",
				amount: 1,
				unique: true
			},
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
				{
					name: "Sword",
					iconClass: "",
					iconPath: "/items/sword4.jpg",
					quality: "rare",
					description: "A common sword, sharp and reliable.",
					unique: false,
					price: {
						gold: 0,
						silver: 5,
						copper: 0
					}
				},
				{
					name: "Armor",
					iconClass: "",
					iconPath: "/items/armor.png",
					quality: "common",
					description: "Heavy armor",
					unique: false,
					price: {
						gold: 1,
						silver: 0,
						copper: 0
					}
				},
				{
					name: "Helmet",
					iconClass: "",
					iconPath: "/items/helmet4.jpg",
					quality: "common",
					description: "A knight's helmet in good condition",
					unique: false,
					price: {
						gold: 0,
						silver: 4,
						copper: 0
					}
				}
			],
			health: 100,
			maxHealth: 100
		} as VendorNPC
	]
};

export const maps: CustomMap[] = [world, winterfell, kingsLanding, starkKeep];
