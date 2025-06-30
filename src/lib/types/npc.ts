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
}

type VendorNPC = NPC & {
	items: string[]; // temp
}

export type { NPC, QuestGiverNPC, VendorNPC };
