<script lang="ts">
	import type { MapWithClickBox } from "$lib/types/mapTypes";
	import MapController from "$lib/controller/map.svelte";
	import { dev } from "$app/environment";

	function onBack() {
		if (MapController.currentMapState?.previous) {
			MapController.currentMapState = MapController.currentMapState.previous;
		}
	}

	function newZone() {
		if (!MapController.currentMapState) {
			return;
		}

		const newObj: MapWithClickBox = {
			clickBox: {
				x: 50,
				y: 150,
				originalX: 50,
				originalY: 150,
				width: 100,
				height: 100,
				rotation: 0
			},
			map: {
				type: "world",
				name: "New Zone",
				imagePath: ""
			}
		};

		MapController.addSubmap(newObj);
		MapController.editMode = true;
		MapController.selectedBox = newObj;
	}

	function toggleEditMode() {
		MapController.editMode = !MapController.editMode;
		if (MapController.editMode === false) {
			MapController.selectedBox = null;
		}
	}
</script>

{#if MapController.currentMapState}
	<h3>{MapController.currentMapState.map?.name}</h3>
	{#if MapController.currentMapState.previous}
		<button type="button" onclick={onBack}>Back</button>
	{/if}
	{#if dev}
		<button type="button" onclick={newZone}>New</button>
		<button type="button" onclick={toggleEditMode}>Edit Mode</button>
		{#if MapController.editMode && MapController.selectedBox && MapController.isSelectedBoxInCurrentMap()}
			<button
			    type="button"
				onclick={() => {
					if (MapController.selectedBox) {
						MapController.removeSubmapByName(MapController.selectedBox.map.name);
						MapController.selectedBox = null;
					}
				}}
			>
				Delete
			</button>
			<!--
				<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.height} />
				<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.width} />
				<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.rotation} />
				<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.x} />
				<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.y} />-->
		{/if}
	{/if}
{/if}
