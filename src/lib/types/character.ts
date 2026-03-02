import type { ClassName } from "$lib/types/class";

type Character = {
	id: number;
	stats: { str: number; int: number; vit: number; char: number; dex: number };
	health: number;
	maxHealth: number;
	name: string;
	race: string;
	age: number;
	imagePath: string;
	faith: string;
	class: ClassName;
	gender: "Male" | "Female" | "Unknown";
	xp: number;
	level: number;
	conditions: string[];
	money: {
		gold: number;
		silver: number;
		copper: number;
	};
};

export type { Character };