<script lang="ts">
	import Map from "$lib/components/map.svelte";
	import MapHeader from "$lib/partials/mapHeader.svelte";
	import { world, winterfell, kingsLanding } from "$lib/tempData";
	import MapStore from "$lib/stores/map.svelte";
	import PlayerWindows from "$lib/partials/playerwindows.svelte";
	import GameWindows from "$lib/partials/gamewindows.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import { onMount } from "svelte";
	import { getRequest } from "$lib/utils/request";
	import {maps} from "$lib/tempData";
	import { isCityMap } from "$lib/typeguards/map";
	import type {Resource} from "$lib/types/resource";
	import { CityController } from "$lib/controller/city.svelte";

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
						WindowStore.quest.x = pos.x;
						WindowStore.quest.y = pos.y;
						break;
					case "Inventory":
						WindowStore.inventory.x = pos.x;
						WindowStore.inventory.y = pos.y;
						break;
					case "Logger":
						WindowStore.logger.x = pos.x;
						WindowStore.logger.y = pos.y;
						break;
					case "Navigator":
						WindowStore.navigation.x = pos.x;
						WindowStore.navigation.y = pos.y;
						break;
					case "Vendor":
						WindowStore.vendor.x = pos.x;
						WindowStore.vendor.y = pos.y;
						break;
					case "Resources":
						WindowStore.resources.x = pos.x;
						WindowStore.resources.y = pos.y;
						break;
					case "Events":
						WindowStore.events.x = pos.x;
						WindowStore.events.y = pos.y;
						break;
					case "Container":
						WindowStore.container.x = pos.x;
						WindowStore.container.y = pos.y;
						break;
					case "UnitManagement":
						WindowStore.unit.x = pos.x;
						WindowStore.unit.y = pos.y;
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
				resources: Resource[];
				plots: {
					building: string,
					cityId: number,
					id: number,
					identifier: string
				}[]
			}>;
			success: boolean;
		}>("/api/cities");

		if (success) {
			for (const city of cities) {
				if (city.resources.length === 0) {
					console.warn("City has no resources which is probably invalid")
				}

				const found = maps.find(v => v.map.name === city.name);
				if(found && isCityMap(found.map)) {
					found.map.city.resources = city.resources.map(r => {
						return {...r, production: CityController.getResource(r.name).production}; // Assumes the production is already calculated and only changes the amount
					});

					for(const plot of city.plots) {
						const id = parseInt(plot.identifier);
						found.map.city.plots[id].building = plot.building;
					}
				}
			}
			console.log("Cities:", cities);
		} else {
			console.error("Failed to fetch window positions");
		}
	}

	const loadFromBackup = true;

	onMount(async () => {
		if(loadFromBackup) {
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
		{#each [world, winterfell, kingsLanding] as map}
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
