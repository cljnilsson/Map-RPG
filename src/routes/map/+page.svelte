<script lang="ts">
	import Map from '$lib/components/map.svelte';
	import MapHeader from '$lib/partials/mapHeader.svelte';
	import { world, winterfell, kingsLanding } from '$lib/tempData';
	import type { CustomMap, MapWithClickBox } from '$lib/types/mapTypes';

	let editMode = $state(false);
	let mapState: CustomMap | null = $state(world);
	let selectedBox: MapWithClickBox | null = $state(null);
</script>

<div class="map-wrapper mt-3">
	{#if mapState}
		<div class="row">
			<div class="col">
				<MapHeader bind:mapState={mapState} bind:editMode={editMode} bind:selectedBox={selectedBox}></MapHeader>
			</div>
		</div>
		<Map bind:currentMapState={mapState} bind:selectedBox {editMode}></Map>
	{:else}
		<p>No map chosen</p>
		{#each [world, winterfell, kingsLanding] as map}
			<button
				onclick={() => {
					mapState = map;
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
