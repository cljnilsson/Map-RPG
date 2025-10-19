<script lang="ts">
	import type { MapWithClickBox } from "$lib/types/mapTypes";
	import { maps } from "$lib/tempData";
	import Draggable from "$lib/utils/Draggable.svelte";
	import ResizeAnchors from "$lib/utils/ResizeAnchors.svelte";
	import MapClickBox from "$lib/components/MapClickBox.svelte";
	import PlotClickBox from "$lib/components/PlotClickBox.svelte";
	import MapController from "$lib/controller/map.svelte";
	import { isCityMap } from "$lib/typeguards/map";
	import { safeGetBuilding, getBuildingsByPlotType } from "$lib/data/buildings";
	import { goto } from "$app/navigation";
	import HoverOutlineImage from "$lib/utils/outline/hoverOutline.svelte";
	import { resolve } from "$app/paths";

	function toggleSelection(rect: MapWithClickBox) {
		//MapStore.selectedBox = MapStore.selectedBox === rect ? null : rect;
		MapController.selectedBox = { ...rect };
	}

	function handleClick(rect: MapWithClickBox) {
		const found = maps.find((map) => map.map?.name === rect.map.name);
		console.log("reee", rect.map.name, found, MapController.editMode);
		if (!found) return;

		if (MapController.editMode) {
			toggleSelection(rect);
		} else {
			MapController.currentMapState = found;
		}
	}

	function handlePlotClick(identifier: number, x: number, y: number, rotation: number) {
		console.log(`Plot ${identifier} clicked at`, x, y, rotation);
		console.log("options:", getBuildingsByPlotType("default"));
		goto(resolve(`/map/${MapController.currentMapState.map.name}/${identifier}/build`));
	}

	function handleBuildingClick(identifier: number) {
		console.log("clicked on building!");
		goto(resolve(`/map/${MapController.currentMapState.map.name}/${identifier}`))
	}

	function onBuildingEnter(e: KeyboardEvent, identifier: number) {
		if (e.key === "Enter" || e.key === " ") {
			handleBuildingClick(identifier);
		}
	}

	$effect(() => {
		console.log(MapController.selectedBox?.map.name);
		//$inspect(MapStore.selectedBox);
	});
</script>

{#if MapController.currentMapState}
	{#each MapController.currentMapState.contains as rect(rect.map.name)}
		{#if MapController.editMode}
			<Draggable
				locked={false}
				bind:x={rect.clickBox.x}
				bind:y={rect.clickBox.y}
				editMode={MapController.editMode}
				containerWrapper=".map-container"
				onDragStart={() => (MapController.selectedBox = rect)}
				onDragEnd={(wasDragged) => {
					if (!wasDragged) handleClick(rect);
				}}
			>
				<MapClickBox {rect} selectedBox={MapController.selectedBox} onClickCallback={() => {}} />
				{#if MapController.editMode && MapController.selectedBox?.map.name === rect.map.name}
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
				<MapClickBox {rect} selectedBox={MapController.selectedBox} onClickCallback={handleClick} />
			</div>
		{/if}
	{/each}
	{#if isCityMap(MapController.currentMapState.map)}
		{#each MapController.currentMapState.map.city.plots as plot, i (i)}
			{#if plot.building === undefined}
				<div style="position: absolute; left: {plot.x}px; top: {plot.y}px;">
					<PlotClickBox
						identifier={i}
						x={220}
						y={120}
						rotation={0}
						selectedBox={MapController.selectedBox}
						onClickCallback={handlePlotClick}
					/>
				</div>
			{:else}
				<div
					role="button"
					tabindex="0"
					onkeydown={(e) => onBuildingEnter(e, i)}
					onclick={() => handleBuildingClick(i)}
					style="position: absolute; left: {plot.x}px; top: {plot.y}px; width: 220px; height: 120px;"
				>
					<HoverOutlineImage
						src={safeGetBuilding(plot.building.replaceAll(" ", "-").toLowerCase())?.artPath ?? ""}
						alt={"The " + plot.building + " building"}
						width={220}
						height={120}
					/>
				</div>
			{/if}
		{/each}
	{/if}
{/if}
