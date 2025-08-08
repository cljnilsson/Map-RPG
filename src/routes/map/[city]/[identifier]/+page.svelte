<script lang="ts">
	import { isCityMap } from "$lib/typeguards/map";
	import MapStore from "$lib/stores/map.svelte";
	import { dev } from "$app/environment";
	import type { Resource } from "$lib/types/resource";
	import ResourceCost from "$lib/components/resourceCost.svelte";
	import { safeGetBuilding } from "$lib/data/buildings";
	import { costToNextLevel } from "$lib/utils/cost";
	import { CityController } from "$lib/controller/city.svelte.js";

	const { data } = $props();
	const plot = Number(data.plot);
	const currentMap = MapStore.currentMapState?.map;
	const isValidPlot = isCityMap(currentMap) && !Number.isNaN(plot) && plot >= 0 && plot < currentMap.city.plots.length;
	const buildingPlot = isValidPlot ? currentMap.city.plots[plot] : null;
	const building = buildingPlot ? safeGetBuilding(buildingPlot.building?.replaceAll(" ", "-").toLowerCase() ?? "") : undefined;

	function upgrade(price: Resource[]) {
		CityController.upgrade(price, plot);
	}

	if (dev) {
		console.log(costToNextLevel(100, 1), costToNextLevel(100, 5), costToNextLevel(100, 10), costToNextLevel(100, 20));
	}
</script>

<div class="container mt-3 px-5">
	<a href="/map">Back</a>

	{#if dev}
		<p>{currentMap?.name} ({isCityMap(currentMap)}) slot: {data.plot}</p>
	{/if}

	{#if currentMap && data.city === currentMap.name && isValidPlot && building && buildingPlot}
		<div class="row justify-content-center">
			<div class="col-auto">
				<img src={building.artPath} alt={"Art of " + building.name} width="200" height="200" />
			</div>
			<div class="col-xl-6 col-md-8">
				<h4 class="border-bottom">{building.name} ({buildingPlot.level})</h4>
				<p>{building.description}</p>

				{#if building.componentOnClick}
					<building.componentOnClick />
				{/if}

				{#if building.cost.length > 0}
					<ResourceCost costs={building.cost} level={buildingPlot.level} />
				{/if}

				<div class="row mt-3">
					<div class="col text-end">
						<span class="px-3">00:00:{building.timeInSeconds}</span>
						<button class="btn btn-primary" onclick={() => upgrade(building.cost)}>Upgrade</button>
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

<style>
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
