import CityStore from "$lib/stores/city.svelte";
import MapController from "$lib/controller/map.svelte";
//import type {City} from "$lib/types/city";
import type {Unit} from "$lib/types/unit";
import type {CityResource, Resource} from "$lib/types/resource";
import { LogController } from "$lib/controller/logs.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { costToNextLevel } from "$lib/utils/cost";
import { postResources } from "$lib/api/resources.remote";

export class CityController {
	// ---------------
	// Variables
	// ---------------
	
	// TODO

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

	public static set units(v: Unit[]) {
		CityStore.units = v;
	}

	public static set resources(v: CityResource[]) {
		CityStore.resources = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static getResource(resource: string): CityResource {
		const found = CityStore.resources.find((v) => v.name === resource);

		if (!found) {
			throw Error("Requesting city resource that does not exist: " + resource);
		}

		return found;
	}

	public static updateResourceAmount(resource: string, newAmount: number) {
		const toUpdate = this.getResource(resource);

		if(!toUpdate) {
			console.warn("Trying to update resource that does not exist " + resource);
			return;
		}

		toUpdate.amount = newAmount;
	}

	public static canAfford(price: Resource[]): boolean {
		let canAfford = true;

		for(const resource of price) {
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


			// Make a helper function to slim down resources later
			const slimmedResources = this.resources.map(r => {
				return {resourceId: r.resourceId, cityDataId: r.cityId, value: r.amount};
			})

			postResources(slimmedResources);

			return true;
		}

		return false;
	}

	public static give(price: Resource[]) {
		for(const resource of price) {
			this.getResource(resource.name).amount += resource.amount; // Might not update object properly
		}
		
		LogController.newLog("You gained new resources"); // More detailed resources here later

		// Automatically save new resources in db
	}

	public static upgrade(price: Resource[], plot: number) {
		if(isCityMap(MapController.currentMapState.map)) {
			const level = MapController.currentMapState.map.city.plots[plot].level;
			const upgraded = this.pay(level === 1 ? price : price.map(v => {
				return {...v, amount: costToNextLevel(v.amount, level)};
			}));

			if(upgraded) {
				MapController.currentMapState.map.city.plots[plot].level += 1;
			}
		}
	}

	public static setMainCityFromCurrentOwned() {
		const owned = MapController.ownedCities;
		if(owned.length === 0) {
			return null;
		}

		CityStore.population = owned[0].city.population;
		CityStore.workers = owned[0].city.workers;
		CityStore.units = owned[0].city.units;
		CityStore.resources = owned[0].city.resources;
	}

	public static getUnitByName(name: string) {
		const unit = CityStore.units.find((v) => v.name === name);

		if (!unit) {
			throw Error("Requesting city unit that does not exist");
		}

		return unit;
	}
}
