<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
    //import Inventory from "$lib/features/inventory/inventory.svelte";
</script>

<Window uniqueKey="Container" height={700} width={480} x={WindowStore.container.x} y={WindowStore.container.y} bind:visibility={WindowStore.container.visible}>
	{#snippet title()}
		<h4 class="my-2">{WindowStore.container.object?.name}</h4>
	{/snippet}
	{#snippet body()}
		{#each WindowStore.container.object?.contains ?? [] as item}
			<p>{item.item.name}</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
