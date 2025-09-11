<script lang="ts">
	import Map from "$lib/components/map.svelte";
	import MapHeader from "$lib/partials/mapHeader.svelte";
	import { world, winterfell, kingsLanding } from "$lib/tempData";
	import MapStore from "$lib/stores/map.svelte";
	import PlayerWindows from "$lib/partials/playerwindows.svelte";
	import GameWindows from "$lib/partials/gamewindows.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import { onMount } from "svelte";
	import { getRequest } from "$lib/utils/request";
	import MapController from "$lib/controller/map.svelte";
	import { isCityMap } from "$lib/typeguards/map";
	import type { CityResource } from "$lib/types/resource";
	import { CityController } from "$lib/controller/city.svelte";
	import {getUnit, safeGetUnit} from "$lib/data/units";
	import type {Unit} from "$lib/types/unit";

	type WindowPosition = {
		id: number;
		characterId: number;
		windowKey: string;
		x: number;
		y: number;
	};

	async function getWindowPositions() {
		const { positions, success } = await getRequest<{
			positions: Array<WindowPosition>;
			success: boolean;
		}>("/api/characters/1/windows"); // Hardcoded because characters are not loaded from database yet

		if (success) {
			const slimmedPositions = positions.map((pos: WindowPosition) => ({ x: pos.x, y: pos.y, windowsKey: pos.windowKey }));
			console.log("Window positions:", slimmedPositions);

			// This works but updates slightly too late, either hide windows until API is called in the future or do it server side.
			for (const pos of slimmedPositions) {
				switch (pos.windowsKey) {
					case "Quests":
						WindowController.getByName("Quests").position = {x: pos.x, y: pos.y};
						break;
					case "Inventory":
						WindowController.getByName("Inventory").position = {x: pos.x, y: pos.y};
						break;
					case "Logger":
						WindowController.getByName("Logger").position = {x: pos.x, y: pos.y};
						break;
					case "Navigator":
						WindowController.getByName("Navigator").position = {x: pos.x, y: pos.y};
						break;
					case "Vendor":
						WindowController.getByName("Vendor").position = {x: pos.x, y: pos.y};
						break;
					case "Resources":
						WindowController.getByName("Resources").position = {x: pos.x, y: pos.y};
						break;
					case "Events":
						WindowController.getByName("Events").position = {x: pos.x, y: pos.y};
						break;
					case "Container":
						WindowController.getByName("Container").position = {x: pos.x, y: pos.y};
						break;
					case "UnitManagement":
						WindowController.getByName("UnitManagement").position = {x: pos.x, y: pos.y};
						break;
					default:
						console.warn(`Unknown window key: ${pos.windowsKey}`);
				}
			}
		} else {
			console.error("Failed to fetch window positions");
		}
	}

	async function getCities() {
		const { cities, success } = await getRequest<{
			cities: Array<{
				id: number;
				cityId: number;
				population: number;
				workers: number;
				name: string;
				units: {
					iconPath: string;
					value: number;
					name: string;
				}[];
				resources: CityResource[];
				plots: {
					building: string;
					cityId: number;
					id: number;
					identifier: string;
				}[];
			}>;
			success: boolean;
		}>("/api/cities");

		if (success) {
			// There has to be a cleaner way to do this, maybe send data more selectively from server so don't have to cleanup
			for (const city of cities) {
				if (city.resources.length === 0) {
					console.warn("City has no resources which is probably invalid");
				}

				const found = MapController.getMapByName(city.name);
				if (found && isCityMap(found.map)) {
					found.map.city.resources = city.resources.map((r) => {
						return { ...r };
					});

					// Missing an attribute or two?
					const toAdd: Unit[] = [];
					for(const u of city.units) {
						const temp = safeGetUnit(u.name);
						if(temp) {
							toAdd.push({...temp, amount: u.value, unlocked: true}); // hardcoded to true, unlocked will be deprecated most likely
						}
					}
					
					found.map.city.units = toAdd;

					for (const plot of city.plots) {
						const id = parseInt(plot.identifier);
						found.map.city.plots[id].building = plot.building;
					}

					found.map.city.workers = city.workers;
					found.map.city.population = city.population;
				}
			}
			console.log("Cities:", cities);
			CityController.setMainCityFromCurrentOwned();
		} else {
			console.error("Failed to fetch cities");
		}
	}

	const loadFromBackup = true;

	onMount(async () => {
		if (loadFromBackup) {
			getWindowPositions();
			getCities();
		}
	});
</script>

<div class="map-wrapper mt-3">
	{#if MapStore.currentMapState}
		<div class="row mx-0">
			<div class="col">
				<MapHeader />
			</div>
		</div>
		<div class="row mx-0">
			<div class="col">
				<Map />
			</div>

			<PlayerWindows />
			<GameWindows />
		</div>
	{:else}
		<p>No map chosen</p>
		{#each [world, winterfell, kingsLanding] as map (map.map.name)}
			<button
				onclick={() => {
					MapStore.currentMapState = map;
				}}>{map.map?.name}</button
			>
		{/each}
	{/if}
</div>

<style>
	.map-wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
