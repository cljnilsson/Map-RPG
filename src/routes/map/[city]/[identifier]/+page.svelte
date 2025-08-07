<script lang="ts">
	import { postRequest } from "$lib/utils/request";
	import { isCityMap } from "$lib/typeguards/map";
	import MapStore from "$lib/stores/map.svelte";
	import { dev } from "$app/environment";
	import type { Building } from "$lib/types/building";
	import { safeGetBuilding } from "$lib/data/buildings";
	import { goto } from "$app/navigation";

	const { data } = $props();
	const plot = validateId(Number(data.plot)) ? Number(data.plot) : -1;

	function validateId(plotIndex: number): boolean {
		if (!isCityMap(MapStore.currentMapState.map)) {
			console.error("Not a city map");
			return false;
		}

		if (Number.isNaN(plotIndex)) {
			console.error(`Invalid plot ID: '${data.plot}' is not a number`);
			return false;
		}

		const plots = MapStore.currentMapState.map.city.plots;

		if (plotIndex < 0 || plotIndex >= plots.length) {
			console.error(`Plot index ${plotIndex} is out of bounds`);
			return false;
		}

		return true;
	}

	function costToNextLevel(base: number, level: number): number {
		return Math.floor((base * 2) * (Math.pow(1.38, level - 1))); // Similar but not identical formula to Travian unit upgrades
	}

	function upgrade() {
		// TODO
	}

	// With a starting cost of sub 100 we never get above 100k resources which sounds balanced to me.
	console.log(costToNextLevel(100, 1), costToNextLevel(100, 5), costToNextLevel(100, 10), costToNextLevel(100, 20));
</script>

<div class="container mt-3 px-5">
	<a href="/map">Back</a>
	{#if dev}
		<p>{MapStore.currentMapState.map.name} ({isCityMap(MapStore.currentMapState.map)}) slot: {data.plot}</p>
	{/if}

	{#if MapStore.currentMapState}
		{#if data.city === MapStore.currentMapState.map.name}
			{#if isCityMap(MapStore.currentMapState.map) && plot >= 0}
				{@const buildingPlot = MapStore.currentMapState.map.city.plots[plot]}
				{@const building = safeGetBuilding(buildingPlot.building?.toLowerCase() ?? "")}
				{#if building}
					<div class="row justify-content-center">
						<div class="col-auto">
							<img src={building?.artPath} alt={"Art of " + building.name} width="150px" height="150px" />
						</div>
						<div class="col-xl-6 col-md-8">
							<h4>{building.name}</h4>
							<p>{building.description}</p>
							{#if building.componentOnClick}
								<building.componentOnClick />
							{/if}
							<div class="text-end">
								<span class="px-3">0:30:14</span><button class="btn btn-primary" onclick={upgrade}>Upgrade</button>
							</div>
						</div>
					</div>
				{/if}
			{/if}
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
