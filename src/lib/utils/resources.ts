import dayjs from "dayjs";
import { CityController } from "$lib/controller/city.svelte";

let lastCalled: Date = new Date(); // This needs to grab the last time from db to get the correct date between runtimes

export function getResources(): number {
	const perMinute = 1;
	const now = new Date();
	const minutesSinceLastCall = lastCalled ? dayjs(now).diff(dayjs(lastCalled), "minute") : 0;

	console.log("Updating resources...");

	if(minutesSinceLastCall > 0) {
		const newResources = minutesSinceLastCall * perMinute;
		lastCalled = now;

		for(const resource of CityController.resources) {
			if(resource.production > 0) {
				resource.amount += newResources * resource.production;
			}
		}

		return newResources;
	}

	return 0;
}

// Run the code once per minute to update resources
if (typeof window !== "undefined") {
	let timer: ReturnType<typeof setInterval> | null = null;

	// Use `queueEffect` instead of onMount/onDestroy for SSR-safe reactivity
	queueMicrotask(() => {
		if(timer) {
			console.warn("Resource timer already running, skipping initialization.");
			return;
		}
		timer = setInterval(() => {
			getResources();
		}, 60 * 1000);
	});

	// Cleanup if the browser unloads
	window.addEventListener("beforeunload", () => {
		if (timer) clearInterval(timer);
	});
}