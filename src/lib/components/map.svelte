<script lang="ts">
	import type { MapWithClickBox, CustomMap } from '$lib/types/mapTypes';
	import { maps } from '$lib/tempData';
	import Draggable from '$lib/utils/Draggable.svelte';
	import ResizeAnchors from '$lib/utils/ResizeAnchors.svelte';

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
</script>

<div class="map-container">
	<img src={currentMapState.map?.imagePath} class={currentMapState.map.type} alt="test" draggable="false" />
	{#each currentMapState.contains as rect}
		<Draggable
			bind:x={rect.clickBox.x}
			bind:y={rect.clickBox.y}
			{editMode}
			containerWrapper=".map-container"
			onDragStart={() => (selectedBox = rect)}
			onDrag={() => {
				console.log("IS DRAGGING");
			}}
			onDragEnd={(wasDragged) => {
				if (!wasDragged) handleClick(rect);
			}}
		>
			<button
				class="overlay-rect"
				class:overlay-rect-editing={selectedBox?.map.name === rect.map.name}
				type="button"
				style="
			width: {rect.clickBox.width}px;
			height: {rect.clickBox.height}px;
			transform: rotate({rect.clickBox.rotation}deg);
			position: relative;
		"
				aria-label={`Clickable area for ${rect.map.name}`}
			></button>
			{#if editMode && selectedBox?.map.name === rect.map.name}
				<ResizeAnchors
					x={rect.clickBox.x}
					y={rect.clickBox.y}
					width={rect.clickBox.width}
					height={rect.clickBox.height}
					rotation={rect.clickBox.rotation}
					resizeBoxBy={(width, height, direction, newX, newY) => {
						rect.clickBox.width = width;
						rect.clickBox.height = height;
						rect.clickBox.x = newX;
						rect.clickBox.y = newY;
					}}
				/>
			{/if}
		</Draggable>
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
