<script lang="ts">
    import MapStore from '$lib/stores/map.svelte';
	import Window from '$lib/features/window/window.svelte';
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={300} width={300} x={800} y={700}>
	{#snippet title()}
		<h4 class="my-2">Navigation</h4>
	{/snippet}
	{#snippet body()}
		{#each MapStore.currentMapState.contains as map}
            <p>{map.map.name}</p>
        {/each }
	{/snippet}
	{#snippet footer()}
        <span></span>
	{/snippet}
</Window>
