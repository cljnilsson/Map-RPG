<script lang="ts">
	import Map from '$lib/components/map.svelte';
	import MapHeader from '$lib/partials/mapHeader.svelte';
	import { world, winterfell, kingsLanding } from '$lib/tempData';
	import MapStore from '$lib/stores/map.svelte';
</script>

<div class="map-wrapper mt-3">
	{#if MapStore.currentMapState}
		<div class="row">
			<div class="col">
				<MapHeader></MapHeader>
			</div>
		</div>
		<Map></Map>
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
