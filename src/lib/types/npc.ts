import type { VendorItem } from "$lib/types/item";

type NPC = {
	health: number;
	maxHealth: number;
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // Also temp
};

type QuestGiverNPC = NPC & {
	quests: string[]; // temp
};

type VendorNPC = NPC & {
	items: VendorItem[];
};

export type { NPC, QuestGiverNPC, VendorNPC };
