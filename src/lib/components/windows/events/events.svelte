<script lang="ts">
	//import MapStore from "$lib/stores/map.svelte";
	import Window from "$lib/features/window/window.svelte";
	//import type { MapWithClickBox } from "$lib/types/mapTypes";
	import WindowStore from "$lib/stores/windows.svelte";
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	height={200}
	width={300}
	x={1600}
	y={1250}
	toggleKey="e"
	bind:visibility={WindowStore.eventsVisibility}
>
	{#snippet title()}
		<h4 class="my-2">Events</h4>
	{/snippet}
	{#snippet body()}
		{#each [] as resource}
			<p>{resource}</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
