<script lang="ts">
	import MapClickBoxes from "$lib/partials/mapClickboxes.svelte";
	import MapStore from "$lib/stores/map.svelte";
	import MiniMenu from "$lib/features/miniMenu/miniMenu.svelte";
	import { onMount } from "svelte";

	let imgRef: HTMLImageElement;
	// Probably not ideal for future proofing but it works for now
	const originalWidth = 2560;
	const originalHeight = 1440;

	function scaleClickBoxes() {
		const currentWidth = window.screen.width;
		const currentHeight = window.screen.height;

		const scaleX = currentWidth / originalWidth;
		const scaleY = currentHeight / originalHeight;
		console.log(scaleX, scaleY);

		MapStore.currentMapState.contains.forEach((rect) => {
			rect.clickBox.x = rect.clickBox.originalX * scaleX;
			rect.clickBox.y = rect.clickBox.originalY * scaleY;
		});
	}

	onMount(() => {
		// For now the world view is not scaled thus this only works for the other views at the moment
		if(MapStore.currentMapState.map.type === "city" || MapStore.currentMapState.map.type === "building") {
			scaleClickBoxes();
		}
	});
</script>

{#if MapStore.currentMapState}
	<div class="map-container">
		<img
			bind:this={imgRef}
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
