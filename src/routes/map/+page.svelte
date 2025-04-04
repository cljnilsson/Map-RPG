<script lang="ts">
    import Map from '$lib/components/map.svelte';
    import { world, winterfell, kingsLanding } from '$lib/tempData';
    import type { CustomMap, MapWithClickBox} from "$lib/types/mapTypes";

	let editMode = $state(true);
	let mapState: CustomMap | null = $state(world);
	let selectedBox: MapWithClickBox | null = $state(null);

	function onBack() {
		if (mapState?.previous) {
			mapState = mapState.previous;
		}
	}

	function newZone() {
		if(!mapState) {
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
				type: 'city'
			}
		}

		mapState.contains = [...mapState.contains, newObj];

		editMode = true;
		selectedBox = newObj;
	}

	function toggleEditMode() {
		editMode = !editMode;
		if(editMode === false) {
			selectedBox = null;
		}
	}
</script>

{#if mapState}
	<h3>{mapState.map?.name}</h3>
	{#if mapState.previous}
		<button
			onclick={onBack}>Back</button
		>
	{/if}
	<button onclick={newZone}>New</button>
	<button onclick={toggleEditMode}>Edit Mode</button>
	{#if editMode && selectedBox}
		{@const found = mapState.contains.find((map) => map.map?.name === selectedBox?.map.name)}
		{#if found}
			<button
				onclick={() => {
					mapState.contains = mapState?.contains.filter((map) => map.map?.name !== selectedBox?.map.name);
					selectedBox = null;
				}}>Delete</button
			>
			<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.height} />
			<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.width} />
			<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.rotation} />
			<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.x} />
			<input type="number" class="form-control" placeholder="Height" bind:value={found.clickBox.y} />
		{/if}
	{/if}
    <Map bind:currentMapState={mapState} bind:selectedBox={selectedBox} {editMode}></Map>
{:else}
	<p>No map chosen</p>
	{#each [world, winterfell, kingsLanding] as map}
		<button
			onclick={() => {
				mapState = map;
			}}>{map.map?.name}</button
		>
	{/each}
{/if}