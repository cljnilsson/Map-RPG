<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
    import Inventory from "$lib/features/inventory/inventory.svelte";
</script>

<Window uniqueKey="Inventory" height={700} width={480} x={WindowStore.inventory.x} y={WindowStore.inventory.y} toggleKey="i" bind:visibility={WindowStore.inventory.visible}>
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
