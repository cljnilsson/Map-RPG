import type { CityResource } from "$lib/types/resource";
import type { Unit } from "$lib/types/unit";

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
	population: number;
	workers: number;
	units: Unit[];
};

export type { City, Plot };