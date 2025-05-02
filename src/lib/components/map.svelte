<script lang="ts">
	import MapClickBoxes from "$lib/partials/mapClickboxes.svelte";
	import MapStore from "$lib/stores/map.svelte";
	import MiniMenu from "$lib/features/miniMenu/miniMenu.svelte";
</script>

{#if MapStore.currentMapState}
	<div class="map-container">
		<img
			loading="lazy"
			src={MapStore.currentMapState.map?.imagePath}
			class={MapStore.currentMapState.map.type}
			alt="test"
			draggable="false"
		/>
		<MapClickBoxes></MapClickBoxes>
	</div>
	<MiniMenu />
{/if}

<style>
	.map-container {
		position: relative;
	}

	img {
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none; /* for Safari */
	}
	img.city,
	img.building {
		height: 90vh;
		width: 100%;
		display: block;
	}
</style>
