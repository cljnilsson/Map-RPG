import dayjs from "dayjs";
import { getResources } from "$lib/api/resources.remote";
import { CityController } from "$lib/controller/city.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { maps } from "$lib/tempData";
import type { CityMap, CustomMap } from "$lib/types/mapTypes";

let lastCalled: Date = new Date(); // This needs to grab the last time from db to get the correct date between runtimes

export async function getCityResources() {
	const now = new Date();
	const minutesSinceLastCall = lastCalled ? dayjs(now).diff(dayjs(lastCalled), "minute") : 0;
	const milisecondsSinceLastCall = now.getTime() - lastCalled.getTime();

	console.log("Updating resources...", 60000 - milisecondsSinceLastCall);

	if (minutesSinceLastCall > 0) {
		lastCalled = now;

		const latestResources = await getResources();
		const allCities: CityMap[] = [];
		for (const x of maps) {
			if (isCityMap(x.map)) {
				allCities.push(x.map);
			}
		}
		const allOwnedCities = allCities.filter((city) => city.city.owned && city.city.unlocked);
		if (allOwnedCities.length === 0) {
			console.warn("No owned cities found");
			return;
		} else if (allOwnedCities.length > 1) {
			console.warn("Only one city is supported");
			return;
		}

		const ownedCity = latestResources.find((city) => city.name === allOwnedCities[0].name);

		console.log("New resources:", latestResources);
		console.log("Owned city:", ownedCity);
		if (ownedCity) {
			for (const resource of ownedCity.resources) {
				const existingResource = CityController.getResource(resource.name);
				if (existingResource.amount !== resource.value) {
					CityController.updateResourceAmount(existingResource, resource.value);
					console.log(`Resource ${resource.name} updated: ${existingResource.amount} -> ${resource.value}`);
				} else {
					console.log(`Resource ${resource.name} amount is unchanged: ${existingResource.amount}`);
				}
			}
		}
	}
}

// Run the code once per minute to update resources
if (typeof window !== "undefined") {
	let timer: ReturnType<typeof setInterval> | null = null;

	// Use `queueEffect` instead of onMount/onDestroy for SSR-safe reactivity
	queueMicrotask(() => {
		if (timer) {
			console.warn("Resource timer already running, skipping initialization.");
			return;
		}
		timer = setInterval(() => {
			getCityResources();
		}, 10 * 1000); // Run every 10 seconds to account for slight timer inaccuracy (10~ miliseconds variation on the 60 second loop)
	});

	// Cleanup if the browser unloads
	window.addEventListener("beforeunload", () => {
		if (timer) clearInterval(timer);
	});
}
