import CityController from "$lib/controller/city.svelte";
import MapController from "$lib/controller/map.svelte";
import type { CityMap } from "$lib/types/mapTypes";

/** Get the single owned & unlocked city from maps */
function getOwnedCity(): CityMap | null {
	const owned: CityMap[] = MapController.ownedCities;

	if (owned.length === 0) {
		console.warn("No owned cities found");
		return null;
	}
	if (owned.length > 1) {
		console.warn("Multiple owned cities detected; only one is supported.");
		return null;
	}
	return owned[0];
}

type NewResource = {
	cityId: number;
	name: string;
	resource: string;
	value: number;
};

/** Updates resources if enough time has passed since last run */
export async function getCityResources(latestResources: NewResource[]) {
	console.log("Updating resources…");

	const ownedCity = getOwnedCity();

	if (!ownedCity) return;

	const cityData = latestResources.find((c) => c.name === ownedCity.name);
	if (!cityData) {
		console.warn(`No resource data found for city: ${ownedCity.name}`);
		return;
	}

	if (CityController.resources.length === 0) {
		console.warn("CityController has no resources, this is probably because you're not in the map view");
		return;
	}

	for (const resource of latestResources.filter((v) => v.name === ownedCity.name)) {
		const existing = CityController.getResource(resource.resource);
		if (existing.amount !== resource.value) {
			CityController.updateResourceAmount(resource.resource, resource.value);
			//console.log(`Resource ${resource.name} updated: ${existing.amount} -> ${resource.value}`);
		} else {
			//console.log(`Resource ${resource.name} unchanged: ${existing.amount}`);
		}
	}
}