import type { CityResource } from "$lib/types/resource";
import type { Unit } from "$lib/types/unit";

const Store = $state<{
	population: number;
	workers: number;
	units: Unit[];
	resources: CityResource[];
	storage: {key: string, amount: number}[]
}>({
	population: 300,
	workers: 4,
	units: [],
	resources: [],
	storage: []
});

export default Store;
