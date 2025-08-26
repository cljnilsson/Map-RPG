import { getResource } from "$lib/data/resources";
import type { CityResource } from "$lib/types/resource";
import type { Unit } from "$lib/types/unit";

const Store = $state<{
	population: number;
	workers: number;
	units: Unit[];
	resources: CityResource[];
}>({
	population: 300,
	workers: 4,
	units: [],
	resources: []
});

export default Store;
