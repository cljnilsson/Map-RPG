<script lang="ts">
	import Map from "$lib/components/map.svelte";
	import MapHeader from "$lib/partials/mapHeader.svelte";
	import { world, winterfell, kingsLanding } from "$lib/tempData";
	import MapStore from "$lib/stores/map.svelte";
	import PlayerWindows from "$lib/partials/playerwindows.svelte";
	import VendorWindow from "$lib/components/windows/vendor/vendor.svelte";
	import VendorStore from "$lib/stores/vendor.svelte";
	import Book from "$lib/features/book/book.svelte";
	import { onMount } from "svelte";
	import { getRequest } from "$lib/utils/request";

	console.log(MapStore.currentMapState);

	async function getWindowPositions() {
		const { positions, success } = await getRequest<{
			positions: Array<{
				id: number;
				characterId: number;
				windowKey: string;
				x: number;
				y: number;
			}>;
			success: boolean;
		}>("/api/characters/1/windows"); // Hardcoded because characters are not loaded from database yet

		if (success) {
			const slimmedPositions = positions.map((pos: any) => ({ x: pos.x, y: pos.y, windowsKey: pos.windowKey }));
			console.log("Window positions:", slimmedPositions);
		} else {
			console.error("Failed to fetch window positions");
		}
	}

	async function getCities() {
		const { cities, success } = await getRequest<{
			cities: Array<{
				id: number,
				cityId: number,
				population: number,
				workers: number,
				name: string,
				resources: []
			}>;
			success: boolean;
		}>("/api/cities");

		if (success) {
			//const slimmedPositions = positions.map((pos: any) => ({ x: pos.x, y: pos.y, windowsKey: pos.windowKey }));
			console.log("Cities:", cities);
		} else {
			console.error("Failed to fetch window positions");
		}
	}

	onMount(async () => {
		getWindowPositions();
		getCities();
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
			{#if VendorStore.currentVendor}
				<VendorWindow vendor={VendorStore.currentVendor} />
			{/if}
			<Book />
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
