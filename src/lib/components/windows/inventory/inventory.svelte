<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
    import Inventory from "$lib/features/inventory/inventory.svelte";
</script>

<Window uniqueKey="Inventory" height={700} width={480} x={300} y={450} toggleKey="i" bind:visibility={WindowStore.inventoryVisibility}>
	{#snippet title()}
		<h4 class="my-2">Inventory</h4>
	{/snippet}
	{#snippet body()}
		<Inventory />
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
