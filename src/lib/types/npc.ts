type NPC = {
	health: number;
	maxHealth: number;
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // Also temp
    quests: string[]; // temp
};

export type { NPC };
