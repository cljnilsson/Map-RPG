<script lang="ts">
    import MapStore from '$lib/stores/map.svelte';
	import Window from '$lib/features/window/window.svelte';
	import type { MapWithClickBox } from '$lib/types/mapTypes';

	function handleHover(map: MapWithClickBox) {
		console.log("Hovered over:", map.map.name);
		// You can trigger a store update or any other logic here
		MapStore.currentNavigationHover = map;
	}
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={300} width={300} x={800} y={700}>
	{#snippet title()}
		<h4 class="my-2">Navigation</h4>
	{/snippet}
	{#snippet body()}
		{#each MapStore.currentMapState.contains as map}
            <p onmouseenter={() => handleHover(map)} onmouseleave={() => MapStore.currentNavigationHover = null}>{map.map.name}</p>
        {/each }
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
