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
	resources: [
		{ ...getResource("Gold"), amount: 100, production: 0, baseLimit: 10 }, // Base productions, should combine with other factors once implemented
		{ ...getResource("Wood"), amount: 50, production: 1, baseLimit: 10 },
		{ ...getResource("Stone"), amount: 30, production: 2, baseLimit: 10 },
		{ ...getResource("Silk"), amount: 30, production: 0, baseLimit: 10 },
		{ ...getResource("Wheat"), amount: 30, production: 3, baseLimit: 10 },
		{ ...getResource("Iron"), amount: 30, production: 1, baseLimit: 10 }
	]
});

export default Store;
