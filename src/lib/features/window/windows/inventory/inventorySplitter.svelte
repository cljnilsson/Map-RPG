<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";

	let { min = 1, max }: { min: number; max: number } = $props();

	let current: number = $state(1);
	let leftStack: number = $derived(current);
	let rightStack: number = $derived(max - current);

	let inventoryWindow = WindowController.getByName("InventorySplitter");
</script>

<Window
	uniqueKey="InventorySplitter"
	height={50}
	width={300}
	x={inventoryWindow.x}
	y={inventoryWindow.y}
	toggleKey={undefined}
	bind:visibility={inventoryWindow.visible}
	canMinimize={false}
	canLock={false}
>
	{#snippet title()}<h4 class="my-2">Splitter</h4>{/snippet}
	{#snippet body()}
		<div class="row justify-content-center align-items-center h-100">
			<div class="col-2 text-center">
				<span class:fw-bold={leftStack > rightStack}>{leftStack}</span>
			</div>
			<div class="col-auto px-0 d-flex align-items-center h-100">
				<input type="range" class="form-range" bind:value={current} {min} {max} />
			</div>
			<div class="col-2 text-center">
				<span class:fw-bold={leftStack < rightStack}>{rightStack}</span>
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
