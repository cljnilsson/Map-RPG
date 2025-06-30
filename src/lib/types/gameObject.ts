type GameObject = {
	name: string;
	img: string;
	position: { x: number; y: number };
	conditions: unknown[]; // Also temp
    quests: string[]; // temp
};

export type { GameObject };
