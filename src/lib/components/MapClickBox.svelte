<script lang="ts">
	import MapStore from "$lib/stores/map.svelte";
	import type { MapWithClickBox } from "$lib/types/mapTypes";

	let {
		rect,
		onClickCallback,
		selectedBox
	}: {
		rect: MapWithClickBox;
		onClickCallback?: (clicked: MapWithClickBox) => void;
		selectedBox: MapWithClickBox | null;
	} = $props();

	function onClick(rect: MapWithClickBox) {
		if(onClickCallback) {
			onClickCallback(rect)
		}
	}
</script>

<button
	class="overlay-rect"
	class:overlay-rect-editing={selectedBox?.map.name === rect.map.name}
	class:overlay-rect-navigation={MapStore.currentNavigationHover?.map.name === rect.map.name}
	type="button"
	onclick={() => onClick(rect)}
	style="
        width: {rect.clickBox.width}px;
        height: {rect.clickBox.height}px;
        transform: rotate({rect.clickBox.rotation}deg);
        position: relative;
    "
	aria-label={`Clickable area for ${rect.map.name}`}
></button>

<style>
	.overlay-rect,
	.overlay-rect-editing {
		position: absolute;
		border: 2px solid red;
		background-color: rgba(255, 0, 0, 0.2);
		cursor: pointer;
	}

	.overlay-rect-editing {
		border-color: green;
		background-color: rgba(0, 255, 0, 0.2);
	}

	.overlay-rect-navigation {
		border-color: yellow !important;
		background-color: rgba(255, 255, 0, 0.2) !important;
	}
</style>
