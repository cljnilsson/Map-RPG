<script lang="ts">
	import type { MapWithClickBox, CustomMap } from '$lib/types/mapTypes';
	import { maps } from '$lib/tempData';

	let {
		currentMapState = $bindable(),
		selectedBox = $bindable(),
		editMode
	}: {
		currentMapState: CustomMap;
		selectedBox: MapWithClickBox | null;
		editMode: boolean;
	} = $props();

	function handleClick(rect: MapWithClickBox) {
		console.log(rect);

		const found = maps.find((map) => map.map?.name === rect.map.name);

		if (!editMode) {
			if (found) {
				currentMapState = found;
			}
		} else {
			if (found) {
				if (selectedBox === rect) {
					selectedBox = null;
				} else {
					selectedBox = rect;
				}
			}
		}
	}

	let dragging = false;
	let didDrag = false;
	let offsetX = 0;
	let offsetY = 0;
	let dragTarget: MapWithClickBox | null = null;

	function startDrag(e: MouseEvent, rect: MapWithClickBox) {
		e.preventDefault();
		dragging = true;
		didDrag = false;
		dragTarget = rect;

		// Mark it as selected when drag starts
		selectedBox = rect;

		offsetX = e.offsetX;
		offsetY = e.offsetY;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', stopDrag);
	}

	function onDrag(e: MouseEvent) {
		if (!dragging || !dragTarget) return;

		didDrag = true; // mark as a drag
		const container = document.querySelector('.map-container') as HTMLElement;
		if (!container) return;

		const rectBounds = container.getBoundingClientRect();

		const newX = e.clientX - rectBounds.left - offsetX;
		const newY = e.clientY - rectBounds.top - offsetY;

		dragTarget.clickBox.x = newX;
		dragTarget.clickBox.y = newY;
	}

	function stopDrag() {
		dragging = false;
		dragTarget = null;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', stopDrag);
	}
</script>

<div class="map-container">
	<img src={currentMapState.map?.imagePath} class={currentMapState.map.type} alt="test" />
	{#each currentMapState.contains as rect}
		<button
			class="overlay-rect"
			class:overlay-rect-editing={selectedBox?.map.name === rect.map.name}
			type="button"
			style="
                left: {rect.clickBox.x}px;
                top: {rect.clickBox.y}px;
                width: {rect.clickBox.width}px;
                height: {rect.clickBox.height}px;
                transform: rotate({rect.clickBox.rotation}deg);
            "
			onclick={() => {
				if (!didDrag) handleClick(rect);
			}}
			onmousedown={(e) => editMode && startDrag(e, rect)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(rect)}
			aria-label={`Clickable area for ${rect.map.name}`}
		></button>
	{/each}
</div>

<style>
	.map-container {
		position: relative;
		display: inline-block;
	}

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

	img.city,
	img.building {
		height: 93vh;
		width: 99vw;
		display: block;
	}
</style>
