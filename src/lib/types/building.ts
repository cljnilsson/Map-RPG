import type { Resource } from "$lib/types/resource";

type Building = {
	id: string;
	name: string;
	requirements: true;
	artPath: string;
	cost: Resource[];
	plotType: "default" | "sacred" | "pristine";
}

export type { Building };
