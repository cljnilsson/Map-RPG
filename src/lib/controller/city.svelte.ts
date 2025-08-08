import CityStore from "$lib/stores/city.svelte";
import MapStore from "$lib/stores/map.svelte";
import type {City} from "$lib/types/city";
import type {Resource} from "$lib/types/resource";
import { LogController } from "$lib/controller/logs.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { costToNextLevel } from "$lib/utils/cost";

export class CityController {
	// ---------------
	// Variables
	// ---------------
	private static inventorySize = 6 * 8; // 8 rows 6 columns

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get population() {
		return CityStore.population;
	}

	public static get workers() {
		return CityStore.workers;
	}

	public static get units() {
		return CityStore.units;
	}

	public static get resources() {
		return CityStore.resources;
	}

	public static set population(v: number) {
		CityStore.population = v;
	}

	public static set workers(v: number) {
		CityStore.workers = v;
	}

	public static set units(v: { soldiers: number; merchants: number; smiths: number; priests: number }) {
		CityStore.units = v;
	}

	public static set resources(v: Resource[]) {
		CityStore.resources = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static getResource(resource: string): Resource {
		const found = CityStore.resources.find((v) => v.name === resource);

		if (!found) {
			throw Error("Requesting city resource that does not exist");
		}

		return found;
	}

	public static canAfford(price: Resource[]): boolean {
		let canAfford = true;

		for(const resource of price) {
			console.log(resource.amount, " vs ", this.getResource(resource.name).amount)
			if(resource.amount > this.getResource(resource.name).amount) {
				canAfford = false;
				break;
			}
		}
		
		return canAfford;
	}
	
	public static pay(price: Resource[]): boolean {
		if(this.canAfford(price)) {
			for(const resource of price) {
				this.getResource(resource.name).amount -= resource.amount; // Might not update object properly
			}
			
			LogController.newLog("You used the city's coffers to pay."); // More detailed costs here later

			// Automatically save new resources in db

			return true;
		}

		return false;
	}

	public static upgrade(price: Resource[], plot: number) {
		if(isCityMap(MapStore.currentMapState.map)) {
			const level = MapStore.currentMapState.map.city.plots[plot].level;
			const upgraded = CityController.pay(level === 1 ? price : price.map(v => {
				return {...v, amount: costToNextLevel(v.amount, level)};
			}));

			if(upgraded) {
				MapStore.currentMapState.map.city.plots[plot].level += 1;
			}
		}
	}
}
