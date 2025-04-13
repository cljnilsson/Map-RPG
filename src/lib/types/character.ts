type Character = {
	stats: { str: number; int: number; vit: number; char: number; dex: number };
	health: number;
	maxHealth: number;
	name: string;
	race: string;
	age: number;
	gender: string;
	conditions: [];
};

export type { Character };
