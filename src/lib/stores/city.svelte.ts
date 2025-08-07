import { getResource } from "$lib/data/resources";
import type {Resource} from "$lib/types/resource";

const Store = $state<{
	population: number;
	workers: number;
	units: { soldiers: number; merchants: number; smiths: number; priests: number };
	resources: Resource[];
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
		{...getResource("Gold"), amount: 100},
		{...getResource("Wood"), amount: 50},
		{...getResource("Stone"), amount: 30},
		{...getResource("Silk"), amount: 30},
		{...getResource("Wheat"), amount: 30},
		{...getResource("Iron"), amount: 30},
	]
});

export default Store;
