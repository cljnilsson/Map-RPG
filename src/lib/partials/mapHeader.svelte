<script lang="ts">
	import type { MapWithClickBox } from '$lib/types/mapTypes';
	import MapStore from '$lib/stores/map.svelte';

	function onBack() {
		if (MapStore.currentMapState?.previous) {
			MapStore.currentMapState = MapStore.currentMapState.previous;
		}
	}

	function newZone() {
		if (!MapStore.currentMapState) {
			return;
		}

		const newObj: MapWithClickBox = {
			clickBox: {
				x: 50,
				y: 150,
				width: 100,
				height: 100,
				rotation: 0
			},
			map: {
				name: 'New Zone',
				imagePath: '',
				type: 'city',
				unlocked: true
			}
		};

		MapStore.currentMapState.contains = [...MapStore.currentMapState.contains, newObj];

		MapStore.editMode = true;
		MapStore.selectedBox = newObj;
	}

	function toggleEditMode() {
		MapStore.editMode = !MapStore.editMode;
		if (MapStore.editMode === false) {
			MapStore.selectedBox = null;
		}
		console.log(MapStore.editMode);
	}
</script>

{#if MapStore.currentMapState}
	<h3>{MapStore.currentMapState.map?.name}</h3>
	{#if MapStore.currentMapState.previous}
		<button onclick={onBack}>Back</button>
	{/if}
	<button onclick={newZone}>New</button>
	<button onclick={toggleEditMode}>Edit Mode</button>
	{#if MapStore.editMode && MapStore.selectedBox}
		{@const found = MapStore.currentMapState.contains.find((map) => map.map?.name === MapStore.selectedBox?.map.name)}
		{#if found}
			<button
				onclick={() => {
					if(MapStore.currentMapState) {
						MapStore.currentMapState.contains = MapStore.currentMapState?.contains.filter(
							(map) => map.map?.name !== MapStore.selectedBox?.map.name
						);
						MapStore.selectedBox = null;
					} else {
						console.error('No current map state found');
					}
					
				}}>Delete</button
			>
			<!--
    <input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.height} />
    <input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.width} />
    <input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.rotation} />
    <input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.x} />
    <input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.y} />-->
		{/if}
	{/if}
{/if}
