import type { CityResource } from "$lib/types/resource";

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
	resources: CityResource[];
	plots: Plot[];
};

export type { City, Plot };
