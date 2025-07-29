import type { Resource } from "$lib/types/resource";

type City = {
	name: string;
	unlocked: boolean;
	owned: boolean;
	resources: Resource[];
};

export type { City };
