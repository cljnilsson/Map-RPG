<script lang="ts">
	import MapClickBoxes from '$lib/partials/mapClickboxes.svelte';
	import MapStore from '$lib/stores/map.svelte';
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
{/if}

<style>
	.map-container {
		position: relative;
		display: inline-block;
	}

	img {
		pointer-events: none;
		user-select: none;
 		-webkit-user-select: none; /* for Safari */
	}
	img.city,
	img.building {
		height: 93vh;
		width: 99vw;
		display: block;
	}
</style>
