import type { Resource } from "$lib/types/resource";
import type { Component } from "svelte";

type Building = {
	id: string;
	name: string;
	description: string;
	requirements: true;
	artPath: string;
	cost: Resource[];
	plotType: "default" | "sacred" | "pristine";
	componentOnClick: Component | undefined;
};

type BuildingData = Building & {
	level: number;
}

export type { Building, BuildingData };
