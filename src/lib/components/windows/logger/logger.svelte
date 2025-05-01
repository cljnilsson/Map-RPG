<script lang="ts">
    //import MapStore from '$lib/stores/map.svelte';
	import Window from '$lib/features/window/window.svelte';
	let visibility = $state(false);
	let log: string[] = $state([]);
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={400} width={700} x={50} y={900} toggleKey="l" bind:visibility>
	{#snippet title()}
		<h4 class="my-2">Log</h4>
	{/snippet}
	{#snippet body()}
		{#each log as logEntry}
            <p>{logEntry}</p>
        {/each }
	{/snippet}
	{#snippet footer()}
        <span></span>
	{/snippet}
</Window>
