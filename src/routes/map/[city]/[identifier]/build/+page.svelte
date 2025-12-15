<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import { isCityMap } from "$lib/typeguards/map";
	import MapController from "$lib/controller/map.svelte";
	import { getBuildingsByPlotType } from "$lib/data/buildings";
	import { dev } from "$app/environment";
	import type { Building } from "$lib/types/building";
	import ResourceCost from "$lib/components/resourceCost.svelte";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	const { data } = $props();
	const buildings = getBuildingsByPlotType("default");

	async function confirmBuilding(pickedBuilding: Building) {
		console.log(pickedBuilding.name);

		if (!isCityMap(MapController.currentMapState.map)) {
			console.error("Not a city map");
			return;
		}

		const plotIndex = Number(data.plot);

		if (Number.isNaN(plotIndex)) {
			console.error(`Invalid plot ID: '${data.plot}' is not a number`);
			return;
		}

		const plots = MapController.currentMapState.map.city.plots;

		if (plotIndex < 0 || plotIndex >= plots.length) {
			console.error(`Plot index ${plotIndex} is out of bounds`);
			return;
		}

		plots[plotIndex] = { ...plots[plotIndex], building: pickedBuilding.name };

		const resp = await postRequest<{ success: boolean }, { building: string; plot: string; city: string }>("/api/cities/build", {
			building: pickedBuilding.name,
			plot: plotIndex + "",
			city: MapController.currentMapState.map.city.name // change to id later?
		});

		console.log(resp);

		// Redirect if all is good
		//goto("/map");
	}
</script>

<div class="container mt-3 px-5">
	<a href={resolve("/map")}>Back</a>
	{#if dev}
		<p>{MapController.currentMapState.map.name} ({isCityMap(MapController.currentMapState.map)}) slot: {data.plot}</p>
	{/if}

	{#if MapController.currentMapState}
		{#if data.city === MapController.currentMapState.map.name}
			{#each buildings as buildingOption (buildingOption.name)}
				<div class="row justify-content-center my-3">
					<div class="col-xl-8 col-md-10 border-bottom">
						<h4>{buildingOption.name} | <span class:text-danger={buildingOption.plotType === "damaged"} class:text-warning={buildingOption.plotType === "sacred"}>{buildingOption.plotType}</span></h4>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-2">
						<img src={buildingOption.artPath} alt={"image of the building " + buildingOption.name} width={200} height={200} />
					</div>
					<div class="col-xl-6 col-md-8">
						<p>{buildingOption.description}</p>
						{#if buildingOption.cost.length > 0}
							<ResourceCost costs={buildingOption.cost} level={1} />
						{/if}
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-8 text-end">
						<span class="px-3">0:30:14</span><button class="btn btn-primary" onclick={() => confirmBuilding(buildingOption)}>Build</button>
					</div>
				</div>
			{/each}
		{:else}
			<p class="text-error text-center">Internal state does not match current URL</p>
		{/if}
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
