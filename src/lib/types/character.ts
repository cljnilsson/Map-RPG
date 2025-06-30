type Character = {
	stats: { str: number; int: number; vit: number; char: number; dex: number };
	health: number;
	maxHealth: number;
	name: string;
	race: string;
	age: number;
	gender: string;
	conditions: [];
	money: {
		gold: number;
		silver: number;
		copper: number;
	};
};

export type { Character };
