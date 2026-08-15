import type { CityResource } from "#lib/types/resource.js";
import type { Unit } from "#lib/types/unit.js";

type Plot = {
	x: number;
	y: number;
	building: string | undefined;
	level: number;
	plotType: "default" | "sacred" | "pristine";
};

type City = {
	id: number;
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