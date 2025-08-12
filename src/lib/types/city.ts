import type { Resource } from "$lib/types/resource";

type Plot = {
	x: number;
	y: number;
	building: string | undefined;
	level: number;
	plotType: "default" | "sacred" | "pristine";
};

type City = {
	name: string;
	unlocked: boolean;
	owned: boolean;
	resources: Resource[];
	plots: Plot[];
};

export type { City, Plot };
