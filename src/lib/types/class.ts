export const classValues = ["Barbarian", "Fighter", "Rogue", "Druid", "Bard", "Ranger", "Monk", "Paladin", "Cleric", "Warlock", "Wizard", "Sorcerer"] as const;

type ClassName = (typeof classValues)[number];

type Class = {
	abilities: string[];
	suggestedStats: string[];
	name: ClassName;
	description: string;
	icon: string;
};

export type { Class, ClassName };