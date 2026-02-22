import type { Resource } from "$lib/types/resource";
import type { Component } from "svelte";

type Building = {
	id: string;
	name: string;
	description: string;
	requirements: true;
	artPath: string;
	cost: Resource[];
	timeInSeconds: number;
	plotType: "default" | "sacred" | "pristine" | "damaged";
	componentOnClick:
		| Component<{ level: number; building: Omit<Building, "componentOnClick">; cityName: string; cityDataId: number }>
		| undefined;
};

type BuildingData = Building & {
	level: number;
};

export type { Building, BuildingData };