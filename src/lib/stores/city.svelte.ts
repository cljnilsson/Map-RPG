import { getResource } from "$lib/data/resources";
import type {CityResource} from "$lib/types/resource";

const Store = $state<{
	population: number;
	workers: number;
	units: { soldiers: number; merchants: number; smiths: number; priests: number };
	resources: CityResource[];
}>({
	population: 300,
	workers: 6,
	units: {
		soldiers: 4,
		merchants: 1,
		smiths: 1,
		priests: 0
	},
	resources: [
		{...getResource("Gold"), amount: 100, production: 0}, // Base productions, should combine with other factors once implemented
		{...getResource("Wood"), amount: 50, production: 1},
		{...getResource("Stone"), amount: 30, production: 2},
		{...getResource("Silk"), amount: 30, production: 0},
		{...getResource("Wheat"), amount: 30, production: 3},
		{...getResource("Iron"), amount: 30, production: 1},
	]
});

export default Store;
