<script lang="ts">
	import Map from '$lib/components/map.svelte';
	import MapHeader from '$lib/partials/mapHeader.svelte';
	import { world, winterfell, kingsLanding } from '$lib/tempData';
	import MapStore from '$lib/stores/map.svelte';
	import Window from '$lib/features/window/window.svelte';
</script>

<div class="map-wrapper mt-3">
	{#if MapStore.currentMapState}
		<div class="row">
			<div class="col">
				<MapHeader></MapHeader>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<Map></Map>
			</div>
			{#if MapStore.currentMapState.map.type === "city"}
				<Window height={300} width={400}>
					{#snippet title()}
						<p>yo1</p>
					{/snippet}
					{#snippet body()}
						<p>yo2</p>
					{/snippet}
					{#snippet footer()}
						<p>yo3</p>
					{/snippet}
				</Window>
			{/if}
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
