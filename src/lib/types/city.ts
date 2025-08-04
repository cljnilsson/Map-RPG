import type { Resource } from "$lib/types/resource";

type City = {
	name: string;
	unlocked: boolean;
	owned: boolean;
	resources: Resource[];
	plots: {
		x: number;
		y: number;
		building: string | undefined;
		plotType: "default" | "sacred" | "pristine"
	}[]
};

export type { City };
