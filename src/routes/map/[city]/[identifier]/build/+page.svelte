<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import { isCityMap } from "$lib/typeguards/map";
	import MapStore from "$lib/stores/map.svelte";
	import { getBuildingsByPlotType } from "$lib/data/buildings";
	import { dev } from "$app/environment";
	import type { Building } from "$lib/types/building";
	import { goto } from "$app/navigation";

	const { data } = $props();
	const buildings = getBuildingsByPlotType("default");

	async function confirmBuilding(pickedBuilding: Building) {
		console.log(pickedBuilding.name);

		if (!isCityMap(MapStore.currentMapState.map)) {
			console.error("Not a city map");
			return;
		}

		const plotIndex = Number(data.plot);

		if (Number.isNaN(plotIndex)) {
			console.error(`Invalid plot ID: '${data.plot}' is not a number`);
			return;
		}

		const plots = MapStore.currentMapState.map.city.plots;

		if (plotIndex < 0 || plotIndex >= plots.length) {
			console.error(`Plot index ${plotIndex} is out of bounds`);
			return;
		}

		plots[plotIndex] = { ...plots[plotIndex], building: pickedBuilding.name };

		const resp = await postRequest<{ success: boolean }, { building: string; plot: string; city: string }>("/api/cities/build", {
			building: pickedBuilding.name,
			plot: plotIndex + "",
			city: MapStore.currentMapState.map.city.name // change to id later?
		});

		console.log(resp);

		// Redirect if all is good
		//goto("/map");
	}
</script>

<div class="container mt-3 px-5">
	<a href="/map">Back</a>
	{#if dev}
		<p>{MapStore.currentMapState.map.name} ({isCityMap(MapStore.currentMapState.map)}) slot: {data.plot}</p>
	{/if}

	{#if MapStore.currentMapState}
		{#if data.city === MapStore.currentMapState.map.name}
			{#each buildings as buildingOption}
				<div class="row justify-content-center my-3">
					<div class="col-6 border-bottom">
						<h4>{buildingOption.name}</h4>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-2">
						<img src={buildingOption.artPath} alt={"image of the building " + buildingOption.name} width={100} height={100} />
					</div>
					<div class="col-4">
						<p>{buildingOption.description}</p>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-6 text-end">
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
