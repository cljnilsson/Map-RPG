<script lang="ts">
	import { isCityMap } from "$lib/typeguards/map";
	import MapStore from "$lib/stores/map.svelte";
	import { dev } from "$app/environment";
	import type { Resource } from "$lib/types/resource";
	import type { MapType } from "$lib/types/mapTypes";
	import type { Plot } from "$lib/types/city";
	import ResourceCost from "$lib/components/resourceCost.svelte";
	import { safeGetBuilding } from "$lib/data/buildings";
	import { CityController } from "$lib/controller/city.svelte.js";
	import type { Building } from "$lib/types/building";
	import { resolve } from "$app/paths";

	// Props
	const { data } = $props();

	// ---- High-level data ----
	const plotIndex = Number(data.plot);
	const currentMap = MapStore.currentMapState?.map;
	const buildingPlot = getBuildingPlot(currentMap, plotIndex);
	const buildingFull = getBuildingFromPlot(buildingPlot);
	const { Component, strippedBuilding } = getComponentData(buildingFull);

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
</script>

<div class="container mt-3 px-5">
	<a href={resolve("/map")}><button class="back btn btn-primary">Back</button></a>

	{#if dev}
		<p>{currentMap?.name} slot: {data.plot}</p>
	{/if}

	{#if currentMap && data.city === currentMap.name && buildingPlot && buildingFull}
		<div class="row justify-content-center">
			<div class="col-auto">
				<img src={buildingFull.artPath} alt={"Art of " + buildingFull.name} width="200" height="200" />
			</div>

			<div class="col-xl-6 col-md-8">
				<h4 class="border-bottom">{buildingFull.name} ({buildingPlot.level})</h4>
				<p>{buildingFull.description}</p>

				{#if Component && strippedBuilding}
					<Component level={buildingPlot.level} building={strippedBuilding} cityName={data.city} />
				{/if}

				{#if buildingFull.cost.length > 0}
					<ResourceCost costs={buildingFull.cost} level={buildingPlot.level} />
				{/if}

				<div class="row mt-3">
					<div class="col text-end">
						<span class="px-3">00:00:{buildingFull.timeInSeconds}</span>
						<button class="btn btn-primary" onclick={() => upgrade(buildingFull.cost)}>Upgrade</button>
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
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}

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
