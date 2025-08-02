<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import { q2c } from "$lib/utils/itemQuality";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	//import Inventory from "$lib/features/inventory/inventory.svelte";

	let baseHeight = 100;
	let perItemHeight = 64;
	let totalHeight = $derived((WindowStore.container.object?.contains ?? []).length * perItemHeight + baseHeight); // Flawed calculation, put more thought into this later

</script>

<Window
	uniqueKey="Container"
	height={totalHeight}
	width={480}
	x={WindowStore.container.x}
	y={WindowStore.container.y}
	bind:visibility={WindowStore.container.visible}
>
	{#snippet title()}
		<h4 class="my-2">{WindowStore.container.object?.name}</h4>
	{/snippet}
	{#snippet body()}
		{#each WindowStore.container.object?.contains ?? [] as item}
			<Tooltip>
				{#snippet tooltip()}
					<h5 style={"color: " + q2c(item.item) + ";"}>{item.item.name}</h5>
					<p>{item.item.description}</p>
				{/snippet}
				<div class="row">
					<div class="col-auto">
						<img src={item.item.iconPath} alt={item.item.name} class="img-fluid" style="max-height: 50px; max-width: 50px;" />
					</div>
					<div class="col">
						<h5 style={"color: " + q2c(item.item) + ";"}>{item.item.name}</h5>
					</div>
				</div>
			</Tooltip>
		{:else}
			<p>Empty</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
