import type { VendorItem } from "$lib/types/item";
import type {Quest} from "$lib/types/quest";

type NPC = {
	health: number;
	maxHealth: number;
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // Also temp
};

type QuestGiverNPC = NPC & {
	quests: Quest[];
};

type VendorNPC = NPC & {
	items: VendorItem[];
};

export type { NPC, QuestGiverNPC, VendorNPC };
