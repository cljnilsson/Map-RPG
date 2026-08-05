import { cleanup, render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomMap } from "$lib/types/mapTypes";

vi.mock("$app/environment", () => ({ dev: true }));

vi.mock("$lib/tempData", () => {
	const world = {
		map: { name: "World", imagePath: "/world.webp", type: "world" },
		previous: null,
		contains: [],
		npcs: [],
		objects: [],
	};

	return { maps: [world], world };
});

import MapHeader from "$lib/partials/mapHeader.svelte";
import MapController from "$lib/controller/map.svelte";
import MapStore from "$lib/stores/map.svelte";
import { maps } from "$lib/tempData";

const initialMapCount = maps.length;

function resetMapState() {
	const currentMap: CustomMap = {
		map: { name: "Editor test map", imagePath: "/editor-test.webp", type: "world" },
		previous: null,
		contains: [],
		npcs: [],
		objects: [],
	};

	MapStore.editMode = false;
	MapStore.currentMapState = currentMap;
	MapStore.selectedBox = null;
	MapStore.currentNavigationHover = null;
	maps.splice(initialMapCount);
}

describe("map developer controls", () => {
	beforeEach(resetMapState);

	afterEach(() => {
		cleanup();
		resetMapState();
	});

	it("adds uniquely named locations to the current map in memory", async () => {
		const user = userEvent.setup();
		render(MapHeader);

		await user.click(screen.getByRole("button", { name: /edit mode/i }));
		await user.click(screen.getByRole("button", { name: "New location" }));
		await user.click(screen.getByRole("button", { name: "New location" }));

		expect(MapController.submaps.map((location) => location.map.name)).toEqual(["New Zone", "New Zone 2"]);
		expect(MapController.selectedBox?.map.name).toBe("New Zone 2");
	});

	it("adds a new map to the in-memory pool and links the selected location to it", async () => {
		const user = userEvent.setup();
		render(MapHeader);

		await user.click(screen.getByRole("button", { name: /edit mode/i }));
		await user.click(screen.getByRole("button", { name: "New location" }));
		await user.click(screen.getByRole("button", { name: "New map" }));
		await user.type(screen.getByLabelText("Map name"), "Moonlit Forest");
		await user.type(screen.getByLabelText("Image path"), "/maps/moonlit-forest.webp");
		await user.click(screen.getByRole("button", { name: "Add map" }));

		const newMap = MapController.getMapByName("Moonlit Forest");
		expect(newMap?.map).toMatchObject({
			name: "Moonlit Forest",
			imagePath: "/maps/moonlit-forest.webp",
			type: "world",
		});
		expect(MapController.submaps[0].map.name).toBe("Moonlit Forest");
	});
});