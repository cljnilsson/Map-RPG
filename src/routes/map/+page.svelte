<script lang="ts">
	import Map from "$lib/components/map.svelte";
	import MapHeader from "$lib/partials/mapHeader.svelte";
	import { world, winterfell, kingsLanding } from "$lib/tempData";
	import MapStore from "$lib/stores/map.svelte";
	import UnitWindow from "$lib/components/windows/unit/unitWindow.svelte";
	import NavigationWindow from "$lib/components/windows/navigator/navigator.svelte";
	import LogWindow from "$lib/components/windows/logger/logger.svelte";
	import ResourceWindow from "$lib/components/windows/resources/resources.svelte";
	import EventWindow from "$lib/components/windows/events/events.svelte";
	import QuestWindow from "$lib/components/windows/quest/quest.svelte";
	import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
	import {isCityMap} from "$lib/typeguards/map";

	console.log(MapStore.currentMapState);
</script>

<div class="map-wrapper mt-3">
	{#if MapStore.currentMapState}
		<div class="row mx-0">
			<div class="col">
				<MapHeader></MapHeader>
			</div>
		</div>
		<div class="row mx-0">
			<div class="col">
				<Map></Map>
			</div>

			{#if isCityMap(MapStore.currentMapState.map)}
				{#if MapStore.currentMapState.map.owned}
					<UnitWindow />
					<ResourceWindow />
				{/if}
				<EventWindow />
			{/if}
			{#if MapStore.currentMapState.contains.length > 0}
				<NavigationWindow />
			{/if}
			<InventoryWindow />
			<QuestWindow />
			<LogWindow />
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
