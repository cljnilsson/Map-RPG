import CityStore from "$lib/stores/city.svelte";
import MapController from "$lib/controller/map.svelte";
import type { Plot } from "$lib/types/city";
import type { Unit } from "$lib/types/unit";
import type { CityResource, Resource } from "$lib/types/resource";
import LogController from "$lib/controller/logs.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { costToNextLevel } from "$lib/utils/cost";
import { postResources } from "$lib/api/resources.remote";

class CityController {
	// ---------------
	// Variables
	// ---------------

	// TODO

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public get population() {
		return CityStore.population;
	}

	public get workers() {
		return CityStore.workers;
	}

	public get units() {
		return CityStore.units;
	}

	public get resources() {
		return CityStore.resources;
	}

	public get storage() {
		return CityStore.storage;
	}

	public set population(v: number) {
		CityStore.population = v;
	}

	public set workers(v: number) {
		CityStore.workers = v;
	}

	public set units(v: Unit[]) {
		CityStore.units = v;
	}

	public set resources(v: CityResource[]) {
		CityStore.resources = v;
	}

	public set storage(v: { key: string; amount: number }[]) {
		CityStore.storage = v;
	}

	public get plots(): Plot[] {
		if (isCityMap(MapController.currentMapState.map)) {
			return MapController.currentMapState.map.city.plots;
		} else {
			return [];
		}
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public getResource(resource: string): CityResource {
		const found = CityStore.resources.find((v) => v.name === resource);

		if (!found) {
			throw Error("Requesting city resource that does not exist: " + resource);
		}

		return found;
	}

	public updateResourceAmount(resource: string, newAmount: number) {
		const toUpdate = this.getResource(resource);

		if (!toUpdate) {
			console.warn("Trying to update resource that does not exist " + resource);
			return;
		}

		toUpdate.amount = newAmount;
	}

	public canAfford(price: Resource[]): boolean {
		let canAfford = true;

		for (const resource of price) {
			if (resource.amount > this.getResource(resource.name).amount) {
				canAfford = false;
				break;
			}
		}

		return canAfford;
	}

	private slimResources() {
		return this.resources.map((r) => {
			return { resourceId: r.resourceId, cityDataId: r.cityId, value: r.amount };
		});
	}

	public pay(price: Resource[]): boolean {
		console.log(1);
		if (this.canAfford(price)) {
			for (const resource of price) {
				this.getResource(resource.name).amount -= resource.amount; // Might not update object properly
			}

			LogController.newLogSimple("You used the city's coffers to pay."); // More detailed costs here later

			const slimmedResources = this.slimResources();

			postResources(slimmedResources);

			return true;
		}

		return false;
	}

	// TODO, make sure it does not exceed city limit
	public give(price: Resource[]) {
		for (const resource of price) {
			this.getResource(resource.name).amount += resource.amount; // Might not update object properly
		}

		LogController.newLogSimple("You gained new resources"); // More detailed resources here later

		const slimmedResources = this.slimResources();

		postResources(slimmedResources);
	}

	public upgrade(price: Resource[], plot: number) {
		if (isCityMap(MapController.currentMapState.map)) {
			const level = MapController.currentMapState.map.city.plots[plot].level;
			const upgraded = this.pay(
				level === 1
					? price
					: price.map((v) => {
							return { ...v, amount: costToNextLevel(v.amount, level) };
						}),
			);

			if (upgraded) {
				MapController.currentMapState.map.city.plots[plot].level += 1;
			}
		}
	}

	public setMainCityFromCurrentOwned() {
		const owned = MapController.ownedCities;
		if (owned.length === 0) {
			return null;
		}

		CityStore.population = owned[0].city.population;
		CityStore.workers = owned[0].city.workers;
		CityStore.units = owned[0].city.units;
		CityStore.resources = owned[0].city.resources;
	}

	public getUnitByName(name: string) {
		const unit = CityStore.units.find((v) => v.name === name);

		if (!unit) {
			throw Error("Requesting city unit that does not exist");
		}

		return unit;
	}
}

const instance = new CityController();

export default instance;