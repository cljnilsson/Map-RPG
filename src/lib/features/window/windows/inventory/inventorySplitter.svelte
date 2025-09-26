<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import Inventory from "$lib/features/inventory/inventory.svelte";

	let { min = 1, max }: { min: number; max: number } = $props();

	let current: number = $state(1);
	let leftStack: number = $derived(current);
	let rightStack: number = $derived(max - current);

	let inventoryWindow = WindowController.getByName("InventorySplitter");
</script>

<Window
	uniqueKey="InventorySplitter"
	height={150}
	width={280}
	x={inventoryWindow.x}
	y={inventoryWindow.y}
	toggleKey="i"
	bind:visibility={inventoryWindow.visible}
>
	{#snippet title()}{/snippet}
	{#snippet body()}
		<div class="row justify-content-center bg-light align-items-center">
			<div class="col-auto">
				{leftStack}
			</div>
			<div class="col-auto d-flex align-items-center">
				<input type="range" class="form-range" bind:value={current} {min} {max} />
			</div>
			<div class="col-auto">
				{rightStack}
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style>
	input {
		width: 200px;
	}
</style>
