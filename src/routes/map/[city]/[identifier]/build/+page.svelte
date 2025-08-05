<script lang="ts">
	import { isCityMap } from "$lib/typeguards/map";
	import MapStore from "$lib/stores/map.svelte";
	import { getBuildingsByPlotType } from "$lib/data/buildings";
	import { dev } from "$app/environment";

	const { data } = $props();
	const buildings = getBuildingsByPlotType("default");
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
					<div class="col-6">
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
						<button class="btn btn-primary">Build</button>
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
