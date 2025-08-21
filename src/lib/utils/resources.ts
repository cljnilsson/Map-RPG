import dayjs from "dayjs";
import { getResources } from "$lib/api/resources.remote";
import { CityController } from "$lib/controller/city.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { maps } from "$lib/tempData";
import type { CityMap } from "$lib/types/mapTypes";

let lastCalled: Date = new Date(); // TODO: Replace with DB lookup for persistence

/** Get the single owned & unlocked city from maps */
function getOwnedCity(): CityMap | null {
	const cities: CityMap[] = maps.map((entry) => entry.map).filter(isCityMap);

	const owned = cities.filter((city) => city.city.owned && city.city.unlocked);

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

/** Updates resources if enough time has passed since last run */
export async function getCityResources() {
	const now = new Date();
	const minutesSinceLastCall = dayjs(now).diff(dayjs(lastCalled), "minute");

	if (minutesSinceLastCall <= 0) {
		return; // Skip until a minute has passed
	}

	lastCalled = now;
	console.log("Updating resources…");

	const latestResources = await getResources();
	const ownedCity = getOwnedCity();

	if (!ownedCity) return;

	const cityData = latestResources.find((c) => c.name === ownedCity.name);
	if (!cityData) {
		console.warn(`No resource data found for city: ${ownedCity.name}`);
		return;
	}

	for (const resource of cityData.resources) {
		const existing = CityController.getResource(resource.name);
		if (existing.amount !== resource.value) {
			CityController.updateResourceAmount(existing, resource.value);
			console.log(`Resource ${resource.name} updated: ${existing.amount} -> ${resource.value}`);
		} else {
			console.log(`Resource ${resource.name} unchanged: ${existing.amount}`);
		}
	}
}

let timer: ReturnType<typeof setInterval> | null = null;

export function startResourceTimer() {
	if (typeof window === "undefined") return;

	// Prevent multiple timers globally
	if (timer) {
		console.warn("Resource timer already running, skipping initialization.");
		return;
	}

	timer = setInterval(getCityResources, 10 * 1000);

	// Clean up when navigating away or refreshing
	window.addEventListener("beforeunload", stopResourceTimer);
}

export function stopResourceTimer() {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}
