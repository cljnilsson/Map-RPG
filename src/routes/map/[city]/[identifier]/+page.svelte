<script lang="ts">
	import { dev } from "$app/environment";
	import { isCityMap } from "$lib/typeguards/map";

	import type { Resource } from "$lib/types/resource";
	import type { MapType } from "$lib/types/mapTypes";
	import type { Plot } from "$lib/types/city";

	import ResourceCost from "$lib/components/resourceCost.svelte";
	import CityController from "$lib/controller/city.svelte.js";
	import { safeGetBuilding } from "$lib/data/buildings";

	import type { Building } from "$lib/types/building";

	import { onMount, tick } from "svelte";
	import { resolve } from "$app/paths";
	import MapController from "$lib/controller/map.svelte";
	import { maps } from "$lib/tempData";
	import { getRequest } from "$lib/utils/request";

	import type { CityResource } from "$lib/types/resource";

	import { getUnit, safeGetUnit } from "$lib/data/units";

	import type { Unit } from "$lib/types/unit";

	// Props
	const { data } = $props();

	// ---- High-level data ----
	const plotIndex = $derived(Number(data.plot));
	let currentMap = $state(MapController.currentMapState?.map);
	let buildingPlot = $derived(getBuildingPlot(currentMap, plotIndex));
	let buildingFull = $derived(getBuildingFromPlot(buildingPlot));
	let { Component, strippedBuilding } = $derived(getComponentData(buildingFull));

	let cityData: {
		id: number | undefined;
		// Can add other of the props later if needed but for now I only need the ID but I am future proofing it a bit with the approach
	} = $state({ id: undefined });

	// ---- Actions ----
	function upgrade(price: Resource[]) {
		CityController.upgrade(price, plotIndex);
	}

	// ---- Helpers ----
	function getBuildingPlot(map: MapType, index: number) {
		if (isCityMap(map) && index >= 0 && index < map.city.plots.length) {
			return map.city.plots[index];
		}
		return null;
	}

	function getBuildingFromPlot(plot: Plot | null) {
		if (!plot) return undefined;
		return safeGetBuilding(plot.building?.replaceAll(" ", "-").toLowerCase() ?? "");
	}

	function getComponentData(building?: Building) {
		if (!building) return { Component: undefined, strippedBuilding: undefined };

		const Component = building.componentOnClick;
		type BuildingWithoutClick = Omit<Building, "componentOnClick">;

		// rename to _unused so eslint doesn't complain
		const { componentOnClick: _unused, ...rest } = building;
		const strippedBuilding: BuildingWithoutClick = rest;

		return { Component, strippedBuilding };
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
					for (const u of city.units) {
						const temp = safeGetUnit(u.name);
						if (temp) {
							toAdd.push({ ...temp, amount: u.value, unlocked: true }); // hardcoded to true, unlocked will be deprecated most likely
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
			currentMap = MapController.cityMaps.filter((v) => v.map.name === data.city)[0].map;
			cityData.id = cities.find((v) => v.name === currentMap.name)?.id;
		} else {
			console.error("Failed to fetch cities");
		}
	}

	onMount(() => {
		// If data does not match state (such as after some SSR or refreshing the page) then fetch data based on props, while this should never happen in production it is annoying in development.
		if (currentMap.name !== data.city && dev) {
			getCities();
		}
	});
</script>

<div class="container mt-3 px-5">
	<a href={resolve("/map")}><button type="button" class="back btn btn-primary">Back</button></a>

	{#if dev}
		<p>{currentMap?.name} (cityDataId: {cityData?.id}) slot: {data.plot}</p>
	{/if}
	{#if currentMap && data.city === currentMap.name && buildingPlot && buildingFull}
		<div class="row justify-content-center">
			<div class="col-auto">
				<img src={buildingFull.artPath} alt={"Art of " + buildingFull.name} width="200" height="200" />
			</div>

			<div class="col-xl-6 col-md-8">
				<h4 class="border-bottom">{buildingFull.name} ({buildingPlot.level})</h4>
				<p>{buildingFull.description}</p>

				{#if Component && strippedBuilding && cityData.id}
					<Component level={buildingPlot.level} building={strippedBuilding} cityName={data.city} cityDataId={cityData.id} />
				{/if}

				{#if buildingFull.cost.length > 0}
					<ResourceCost costs={buildingFull.cost} level={buildingPlot.level} />
				{/if}

				<div class="row mt-3">
					<div class="col text-end">
						<span class="px-3">00:00:{buildingFull.timeInSeconds}</span>
						<button type="button" class="btn btn-primary" onclick={() => upgrade(buildingFull.cost)}>Upgrade</button>
					</div>
				</div>
			</div>
		</div>
	{:else if currentMap && data.city !== currentMap.name}
		<p class="text-error text-center">Internal state does not match current URL</p>
	{:else}
		<p class="text-center text-muted">Loading or invalid plot...</p>
	{/if}
</div>

<style lang="scss">
	.back {
		background-color: #e3c9b2;
		border-color: #794f36;
		color: #685247;
		&:hover {
			background-color: #dfb48e;
			border-color: #794f36;
			color: #64483a;
		}
	}
</style>
