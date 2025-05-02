<script lang="ts">
	import type { MapWithClickBox } from "$lib/types/mapTypes";
	import { maps } from "$lib/tempData";
	import Draggable from "$lib/utils/Draggable.svelte";
	import ResizeAnchors from "$lib/utils/ResizeAnchors.svelte";
	import MapClickBox from "$lib/components/MapClickBox.svelte";
	import MapStore from "$lib/stores/map.svelte";

	function toggleSelection(rect: MapWithClickBox) {
		//MapStore.selectedBox = MapStore.selectedBox === rect ? null : rect;
		MapStore.selectedBox = { ...rect };
	}

	function handleClick(rect: MapWithClickBox) {
		const found = maps.find((map) => map.map?.name === rect.map.name);
		console.log("reee", rect.map.name, found, MapStore.editMode);
		if (!found) return;

		if (MapStore.editMode) {
			toggleSelection(rect);
		} else {
			MapStore.currentMapState = found;
		}
	}
	$effect(() => {
		console.log(MapStore.selectedBox?.map.name);
		//$inspect(MapStore.selectedBox);
	});
</script>

{#if MapStore.currentMapState}
	{#each MapStore.currentMapState.contains as rect}
		{#if MapStore.editMode}
			<Draggable
				bind:x={rect.clickBox.x}
				bind:y={rect.clickBox.y}
				editMode={MapStore.editMode}
				containerWrapper=".map-container"
				onDragStart={() => (MapStore.selectedBox = rect)}
				onDragEnd={(wasDragged) => {
					if (!wasDragged) handleClick(rect);
				}}
			>
				<MapClickBox {rect} selectedBox={MapStore.selectedBox} onClickCallback={() => {}}
				></MapClickBox>
				{#if MapStore.editMode && MapStore.selectedBox?.map.name === rect.map.name}
					<ResizeAnchors
						bind:x={rect.clickBox.x}
						bind:y={rect.clickBox.y}
						bind:width={rect.clickBox.width}
						bind:height={rect.clickBox.height}
						bind:rotation={rect.clickBox.rotation}
					/>
				{/if}
			</Draggable>
		{:else}
			<div style="position: absolute; left: {rect.clickBox.x}px; top: {rect.clickBox.y}px;">
				<MapClickBox {rect} selectedBox={MapStore.selectedBox} onClickCallback={handleClick}
				></MapClickBox>
			</div>
		{/if}
	{/each}
{/if}
