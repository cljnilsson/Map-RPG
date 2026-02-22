import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MapWithClickBox, CustomMap, CityMap } from "$lib/types/mapTypes";

// --- MOCKS ---

const mockMapStore = {
	editMode: false,
	currentMapState: {
		map: { name: "Test World", imagePath: "world.png", type: "world" },
		previous: null,
		contains: [] as MapWithClickBox[],
		npcs: [],
		objects: [],
	} as CustomMap,
	selectedBox: null as MapWithClickBox | null,
	currentNavigationHover: null as MapWithClickBox | null,
};

const mockMaps: CustomMap[] = [
	{
		map: {
			name: "City One",
			imagePath: "city1.png",
			type: "city",
			city: { owned: true, unlocked: true },
		} as CityMap,
		previous: null,
		contains: [],
		npcs: [],
		objects: [],
	},
	{
		map: {
			name: "Locked City",
			imagePath: "city2.png",
			type: "city",
			city: { owned: true, unlocked: false },
		} as CityMap,
		previous: null,
		contains: [],
		npcs: [],
		objects: [],
	},
	{
		map: { name: "World One", imagePath: "world1.png", type: "world" },
		previous: null,
		contains: [],
		npcs: [],
		objects: [],
	},
];

// Mock MapStore
vi.mock("$lib/stores/map.svelte", () => {
	return {
		default: {
			editMode: false,
			currentMapState: {
				map: { name: "Test World", imagePath: "world.png", type: "world" },
				previous: null,
				contains: [],
				npcs: [],
				objects: [],
			},
			selectedBox: null,
			currentNavigationHover: null,
		},
	};
});

// Mock maps data
vi.mock("$lib/tempData", () => {
	return {
		maps: [
			{
				map: {
					name: "City One",
					imagePath: "city1.png",
					type: "city",
					city: { owned: true, unlocked: true },
				},
				previous: null,
				contains: [],
				npcs: [],
				objects: [],
			},
			{
				map: {
					name: "Locked City",
					imagePath: "city2.png",
					type: "city",
					city: { owned: true, unlocked: false },
				},
				previous: null,
				contains: [],
				npcs: [],
				objects: [],
			},
			{
				map: { name: "World One", imagePath: "world1.png", type: "world" },
				previous: null,
				contains: [],
				npcs: [],
				objects: [],
			},
		],
	};
});

// Mock typeguard
vi.mock("$lib/typeguards/map", () => {
	return {
		isCityMap: (map: any) => map?.type === "city",
	};
});

import MapStore from "$lib/stores/map.svelte";
import { maps } from "$lib/tempData";
import MapController from "$lib/controller/map.svelte";

describe("MapController", () => {
	beforeEach(() => {
		// Reset store before each test
		MapStore.editMode = false;
		MapStore.currentMapState = {
			map: { name: "Test World", imagePath: "world.png", type: "world" },
			previous: null,
			contains: [],
			npcs: [],
			objects: [],
		};
		MapStore.selectedBox = null;
		MapStore.currentNavigationHover = null;
	});

	it("should get and set editMode", () => {
		expect(MapController.editMode).toBe(false);
		MapController.editMode = true;
		expect(MapStore.editMode).toBe(true);
	});

	it("should get and set currentMapState", () => {
		expect(MapController.currentMapState.map.name).toBe("Test World");

		const newMap: CustomMap = {
			map: { name: "Other World", imagePath: "other.png", type: "world" },
			previous: null,
			contains: [],
			npcs: [],
			objects: [],
		};

		MapController.currentMapState = newMap;
		expect(MapStore.currentMapState.map.name).toBe("Other World");
	});

	it("should get and set selectedBox", () => {
		expect(MapController.selectedBox).toBeNull();

		const box: MapWithClickBox = {
			map: { name: "BoxMap", imagePath: "box.png", type: "world" },
			clickBox: { x: 0, y: 0, originalX: 0, originalY: 0, width: 10, height: 10, rotation: 0 },
		};

		MapController.selectedBox = box;
		expect(MapStore.selectedBox).toEqual(box);
	});

	it("should return all maps", () => {
		expect(MapController.maps).toBe(maps);
	});

	it("should filter cityMaps", () => {
		const cityMaps = MapController.cityMaps;
		expect(cityMaps.length).toBe(2);
		expect(cityMaps.every((m) => m.map.type === "city")).toBe(true);
	});

	it("should return only cities (CityMap type)", () => {
		const cities = MapController.cities;
		expect(cities.length).toBe(2);
		expect(cities.every((c) => c.type === "city")).toBe(true);
	});

	it("should return ownedCities (unlocked only)", () => {
		const ownedCities = MapController.ownedCities;
		expect(ownedCities.length).toBe(1);
		expect(ownedCities[0].name).toBe("City One");
	});

	it("should getMapByName", () => {
		const found = MapController.getMapByName("City One");
		expect(found?.map.name).toBe("City One");

		const notFound = MapController.getMapByName("Missing");
		expect(notFound).toBeUndefined();
	});

	it("should add and remove submaps", () => {
		const submap: MapWithClickBox = {
			map: { name: "Submap A", imagePath: "sub.png", type: "world" },
			clickBox: { x: 1, y: 1, originalX: 1, originalY: 1, width: 5, height: 5, rotation: 0 },
		};

		MapController.addSubmap(submap);
		expect(MapController.submaps).toContainEqual(submap);

		const removed = MapController.removeSubmapByName("Submap A");
		expect(removed).toBe(true);
		expect(MapController.submaps).not.toContainEqual(submap);
	});

	it("should getSubMapByName", () => {
		const submap: MapWithClickBox = {
			map: { name: "Submap B", imagePath: "sub.png", type: "world" },
			clickBox: { x: 2, y: 2, originalX: 2, originalY: 2, width: 5, height: 5, rotation: 0 },
		};

		MapController.addSubmap(submap);
		const found = MapController.getSubMapByName("Submap B");

		expect(found).toEqual(submap);
		expect(MapController.getSubMapByName("Missing")).toBeUndefined();
	});

	it("should check if selectedBox is in currentMap", () => {
		expect(MapController.isSelectedBoxInCurrentMap()).toBe(false);

		const submap: MapWithClickBox = {
			map: { name: "Submap C", imagePath: "sub.png", type: "world" },
			clickBox: { x: 3, y: 3, originalX: 3, originalY: 3, width: 5, height: 5, rotation: 0 },
		};

		MapController.addSubmap(submap);
		MapController.selectedBox = submap;

		expect(MapController.isSelectedBoxInCurrentMap()).toBe(true);
	});
});