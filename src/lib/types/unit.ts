import type { Resource } from "$lib/types/resource";

type BaseUnit = {
	id: string;
	name: string;
	description: string;
	icon: string;
	cost: Resource[];
	timeInSeconds: number,
	unlockedBy: {
		buildingName: string;
		level: number;
	} | true;
}

type Unit = BaseUnit & {
	amount: number;
	unlocked: boolean; // Remove this but keep for the moment to not break things
};

export type { BaseUnit, Unit };
