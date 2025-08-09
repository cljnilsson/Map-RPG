<script lang="ts">
	import MapController from "$lib/controller/map.svelte";
	import Window from "$lib/features/window/window.svelte";
	import type { MapWithClickBox } from "$lib/types/mapTypes";
	import WindowStore from "$lib/stores/windows.svelte";

	function handleHover(map: MapWithClickBox) {
		console.log("Hovered over:", map.map.name);
		// You can trigger a store update or any other logic here
		MapController.currentNavigationHover = map;
	}
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	uniqueKey="Navigator"
	height={200}
	width={300}
	x={WindowStore.navigation.x}
	y={WindowStore.navigation.y}
	toggleKey="n"
	bind:visibility={WindowStore.navigation.visible}
>
	{#snippet title()}
		<h4 class="my-2">Navigation</h4>
	{/snippet}
	{#snippet body()}
		{#each MapController.currentMapState.contains as map}
			<p onmouseenter={() => handleHover(map)} onmouseleave={() => (MapController.currentNavigationHover = null)}>
				{map.map.name}
			</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style lang="scss">
	p {
		&:hover {
			font-weight: bold;
		}
	}
</style>
