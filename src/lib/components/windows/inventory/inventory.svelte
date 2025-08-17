<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
    import Inventory from "$lib/features/inventory/inventory.svelte";
</script>

<Window uniqueKey="Inventory" height={700} width={480} x={WindowController.inventory.x} y={WindowController.inventory.y} toggleKey="i" bind:visibility={WindowController.inventory.visible}>
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
