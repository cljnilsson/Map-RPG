<script lang="ts">
	import MapClickBoxes from "$lib/partials/mapClickboxes.svelte";
	import MapController from "$lib/controller/map.svelte";
	import MiniMenu from "$lib/features/miniMenu/miniMenu.svelte";
	import WindowMenu from "$lib/features/miniMenu/iconMenu.svelte";
	import { onMount } from "svelte";
	import { isCityMap, isBuildingMap, isWorldMap } from "$lib/typeguards/map";
	import NPCS from "$lib/components/npcs.svelte";
	import GameObjects from "$lib/components/gameobjects.svelte";

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

		MapController.currentMapState.contains.forEach((rect) => {
			rect.clickBox.x = rect.clickBox.originalX * scaleX;
			rect.clickBox.y = rect.clickBox.originalY * scaleY;
		});
	}

	onMount(() => {
		// For now the world view is not scaled thus this only works for the other views at the moment
		if (isCityMap(MapController.currentMapState.map) || isBuildingMap(MapController.currentMapState.map)) {
			scaleClickBoxes();
		}
	});
</script>

{#if MapController.currentMapState}
	<div class="map-container">
		<img
			bind:this={imgRef}
			fetchpriority="high"
			src={MapController.currentMapState.map?.imagePath}
			class:city={isCityMap(MapController.currentMapState.map)}
			class:world={isWorldMap(MapController.currentMapState.map)}
			class:building={isBuildingMap(MapController.currentMapState.map)}
			alt="A zoomed out view of the map"
			draggable="false"
		/>
		<MapClickBoxes />
		<NPCS />
		<GameObjects />
	</div>
	<MiniMenu />
	<WindowMenu />
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
