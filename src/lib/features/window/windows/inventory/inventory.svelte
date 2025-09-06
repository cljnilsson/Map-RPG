<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
    import Inventory from "$lib/features/inventory/inventory.svelte";

	let inventoryWindow = WindowController.getByName("Inventory");
</script>

<Window uniqueKey="Inventory" height={700} width={480} x={inventoryWindow.x} y={inventoryWindow.y} toggleKey="i" bind:visibility={inventoryWindow.visible}>
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
