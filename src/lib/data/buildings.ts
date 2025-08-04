import type { Building } from "$lib/types/building";

// Types are either Item, VendorItem or UsableItem all of which are subtypes of Item if not Item itself
const buildingRegistry = {
	"black-market": (): Building => ({
		id: "black-market",
		name: "Black Market",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default"
	})
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(buildingRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Building ID mismatch: key "${key}" does not match building ID "${value().id}"`);
	}
}

export type BuildingId = keyof typeof buildingRegistry;

export function getBuilding<T extends BuildingId>(id: T) {
	return buildingRegistry[id]();
}

export function getBuildingsByPlotType(plotType: "default" | "sacred" | "pristine") : Building[] {
	const found: Building[] = [];

	for (const building of Object.values(buildingRegistry)) {
		const b = building();
		if (b.plotType === plotType) {
			found.push(b);
		}
	}

	return found;
}