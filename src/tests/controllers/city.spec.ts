import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { world } from "$lib/tempData"; // Should not reuse this in the long run

// Mock stores and dependencies
vi.mock("$lib/stores/city.svelte", () => ({
	default: {
		population: 0,
		workers: 0,
		units: { soldiers: 0, merchants: 0, smiths: 0, priests: 0 },
		resources: []
	}
}));

vi.mock("$lib/stores/map.svelte", () => ({
	default: {
		currentMapState: world
	}
}));

vi.mock("$lib/controller/logs.svelte", () => ({
	LogController: {
		newLog: vi.fn()
	}
}));

vi.mock("$lib/typeguards/map", () => ({
	isCityMap: vi.fn()
}));

vi.mock("$lib/utils/cost", () => ({
	costToNextLevel: vi.fn((amount: number, level: number) => amount * level)
}));

const mockedIsCityMap = isCityMap as unknown as Mock<(map: MapType) => map is CityMap>;
const mockedCostToNextLevel = costToNextLevel as unknown as Mock<typeof costToNextLevel>;
const mockedNewLog = LogController.newLog as unknown as Mock<typeof LogController.newLog>;

import CityStore from "$lib/stores/city.svelte";
import MapStore from "$lib/stores/map.svelte";
import { LogController } from "$lib/controller/logs.svelte";
import { isCityMap } from "$lib/typeguards/map";
import { costToNextLevel } from "$lib/utils/cost";
import { CityController } from "$lib/controller/city.svelte";
import type { CityResource, Resource } from "$lib/types/resource";
import type { CityMap, WorldMap, MapType } from "$lib/types/mapTypes";

describe("CityController", () => {
	beforeEach(() => {
		// Reset store state before each test
		CityStore.population = 100;
		CityStore.workers = 20;
		CityStore.units = { soldiers: 10, merchants: 5, smiths: 2, priests: 1 };
		CityStore.resources = [
			{ name: "gold", iconPath: "gold.png", amount: 100, production: 0 },
			{ name: "wood", iconPath: "wood.png", amount: 50, production: 0 }
		];

		mockedIsCityMap.mockClear();
		mockedCostToNextLevel.mockClear();
		mockedNewLog.mockClear();

		MapStore.currentMapState = world;
	});

	// --- GETTERS & SETTERS ---
	it("should get and set population", () => {
		expect(CityController.population).toBe(100);
		CityController.population = 200;
		expect(CityStore.population).toBe(200);
	});

	it("should get and set workers", () => {
		expect(CityController.workers).toBe(20);
		CityController.workers = 30;
		expect(CityStore.workers).toBe(30);
	});

	it("should get and set units", () => {
		expect(CityController.units.soldiers).toBe(10);
		CityController.units = { soldiers: 1, merchants: 2, smiths: 3, priests: 4 };
		expect(CityStore.units.smiths).toBe(3);
	});

	it("should get and set resources", () => {
		expect(CityController.resources.length).toBe(2);
		const newResources: CityResource[] = [{ name: "stone", iconPath: "stone.png", amount: 99, production: 0 }];
		CityController.resources = newResources;
		expect(CityStore.resources).toEqual(newResources);
	});

	// --- getResource ---
	it("should return existing resource", () => {
		const res = CityController.getResource("gold");
		expect(res.amount).toBe(100);
	});

	it("should throw if resource not found", () => {
		expect(() => CityController.getResource("iron")).toThrow("Requesting city resource that does not exist");
	});

	// --- canAfford ---
	it("should return true if city can afford price", () => {
		expect(CityController.canAfford([{ name: "gold", iconPath: "", amount: 50 }])).toBe(true);
	});

	it("should return false if city cannot afford price", () => {
		expect(CityController.canAfford([{ name: "gold", iconPath: "", amount: 150 }])).toBe(false);
	});

	// --- pay ---
	it("should deduct resources and log when payment is successful", () => {
		const result = CityController.pay([{ name: "gold", iconPath: "", amount: 30 }]);
		expect(result).toBe(true);
		expect(CityController.getResource("gold").amount).toBe(70);
		expect(LogController.newLog).toHaveBeenCalledWith("You used the city's coffers to pay.");
	});

	it("should not change resources or log if payment fails", () => {
		const result = CityController.pay([{ name: "gold", iconPath: "", amount: 300 }]);
		expect(result).toBe(false);
		expect(CityController.getResource("gold").amount).toBe(100);
		expect(LogController.newLog).not.toHaveBeenCalled();
	});

	// --- give ---
	it("should add resources and log", () => {
		CityController.give([{ name: "gold", iconPath: "", amount: 10 }]);
		expect(CityController.getResource("gold").amount).toBe(110);
		expect(LogController.newLog).toHaveBeenCalled();
	});

	// --- upgrade ---
	it("should upgrade plot at level 1 using given price", () => {
		mockedIsCityMap.mockReturnValue(true);

		const cityMap: CityMap = {
			type: "city",
			name: "test-city",
			imagePath: "test.png",
			city: {
				name: "Test City",
				unlocked: true,
				owned: true,
				resources: [
					{ name: "gold", iconPath: "gold.png", amount: 100, production: 0 },
					{ name: "wood", iconPath: "wood.png", amount: 50, production: 0 }
				],
				plots: [{ x: 0, y: 0, building: undefined, level: 1, plotType: "default" }]
			}
		};

		MapStore.currentMapState.map = cityMap;

		const price: Resource[] = [{ name: "gold", iconPath: "", amount: 10 }];
		CityController.upgrade(price, 0);

		const map = MapStore.currentMapState.map as CityMap; // Hacky but works

		expect(map.city.plots[0].level).toBe(2);
		expect(LogController.newLog).toHaveBeenCalled();
	});

	it("should upgrade plot at higher level using costToNextLevel", () => {
		mockedIsCityMap.mockReturnValue(true);
		mockedCostToNextLevel.mockReturnValue(9);

		const cityMap: CityMap = {
			type: "city",
			name: "test-city",
			imagePath: "test.png",
			city: {
				name: "Test City",
				unlocked: true,
				owned: true,
				resources: [
					{ name: "gold", iconPath: "gold.png", amount: 100, production: 0 },
					{ name: "wood", iconPath: "wood.png", amount: 50, production: 0 }
				],
				plots: [{ x: 0, y: 0, building: undefined, level: 3, plotType: "default" }]
			}
		};
		MapStore.currentMapState.map = cityMap;

		const price: Resource[] = [{ name: "gold", iconPath: "", amount: 10 }];
		CityController.upgrade(price, 0);

		const map = MapStore.currentMapState.map as CityMap; // Hacky but works

		expect(costToNextLevel).toHaveBeenCalledWith(10, 3);
		expect(map.city.plots[0].level).toBe(4);
	});

	it("should not upgrade if not a city map", () => {
		mockedIsCityMap.mockReturnValue(false);
		MapStore.currentMapState.map = {
			name: "Westeros",
			type: "world",
			imagePath: "/map1.jpg"
		} as WorldMap;

		CityController.upgrade([{ name: "gold", iconPath: "", amount: 10 }], 0);
		expect(LogController.newLog).not.toHaveBeenCalled();
	});
});
