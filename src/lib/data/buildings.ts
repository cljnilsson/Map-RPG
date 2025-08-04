import type { Building } from "$lib/types/building";

const buildingRegistry = {
	"black-market": (): Building => ({
		id: "black-market",
		name: "Black Market",
		description: "",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"library": (): Building => ({
		id: "library",
		name: "Library",
		description: "",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"inn": (): Building => ({
		id: "inn",
		name: "Inn",
		description: "Not only good for morale, but also makes it easy to find people as the community gathers in the evening.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"shrine": (): Building => ({
		id: "shrine",
		name: "Shrine",
		description: "A simple center of the faith, enables the recruitment of priests.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "sacred",
		componentOnClick: undefined
	}),
	"watch-tower": (): Building => ({
		id: "watch-tower",
		name: "Watchtower",
		description: "TBD",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"barracks": (): Building => ({
		id: "barracks",
		name: "Barracks",
		description: "Houses your soldiers, your max capacity gets increased.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"adventure-guild": (): Building => ({
		id: "adventure-guild",
		name: "Adventurer's Guild",
		description: "Offers rewarding contracts for various dangerous tasks.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
	"hunter-lodge": (): Building => ({
		id: "hunter-lodge",
		name: "Hunters' Lodge",
		description: "Allows rangers to put their bows to use in peacetime, allows recruitment of rangers.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		plotType: "default",
		componentOnClick: undefined
	}),
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