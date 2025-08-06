<script lang="ts">
	import type { MapWithClickBox } from "$lib/types/mapTypes";

	let {
		x,
		y,
		rotation,
		identifier,
		onClickCallback,
	}: {
		x: number;
		y: number;
		rotation: number;
		identifier: number;
		onClickCallback?: (identifier: number, x: number, y: number, rotation: number) => void;
		selectedBox: MapWithClickBox | null;
	} = $props();

	function onClick(x: number, y: number, rotation: number) {
		if (onClickCallback) {
			onClickCallback(identifier, x, y, rotation);
		}
	}
</script>

<button
	class="overlay-rect"
	type="button"
	onclick={() => onClick(x, y, rotation)}
	style="
        width: {x}px;
        height: {y}px;
        transform: rotate({rotation}deg);
        position: relative;
    "
	aria-label={"Clickable area for a building plot"}
></button>

<style>
	.overlay-rect {
		position: absolute;
		border: 2px solid rgb(0, 225, 255);
		background-color: rgba(0, 255, 255, 0.2);
		cursor: pointer;
	}
</style>
