<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import { q2c } from "$lib/utils/itemQuality";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { InventoryItem } from "$lib/types/item";
	import { PlayerController } from "$lib/controller/character.svelte";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let baseHeight = 100;
	let perItemHeight = 64;
	let totalHeight = $derived((WindowController.container.object?.contains ?? []).length * perItemHeight + baseHeight); // Flawed calculation, put more thought into this later, set a max height at some point

	function onClick(item: InventoryItem) {
		if (!WindowController.container.object) {
			return; // No container object, nothing to do
		}

		if (WindowController.container.object.contains.findIndex((i) => i.item.id === item.item.id) === -1) {
			console.warn("Item not found in container:", item);
			return; // Item not found in the container, nothing to do
		}

		const worked = PlayerController.giveItem(item.item);
		if (worked) {
			WindowController.container.object.contains = WindowController.container.object.contains.filter(
				(i) => i.item.id !== item.item.id
			);
		}
	}
</script>

<Window
	uniqueKey="Container"
	height={totalHeight}
	width={380}
	x={WindowController.container.x}
	y={WindowController.container.y}
	bind:visibility={WindowController.container.visible}
>
	{#snippet title()}
		<h4 class="my-2">{WindowController.container.object?.name}</h4>
	{/snippet}
	{#snippet body()}
		{#each WindowController.container.object?.contains ?? [] as item}
			<Tooltip>
				{#snippet tooltip()}
					<h5 style={"color: " + q2c(item.item) + ";"}>{item.item.name}</h5>
					<p>{item.item.description}</p>
				{/snippet}
				<div class="row">
					<div class="col">
						<ClickableElement onClickCallback={() => onClick(item)}>
							<div class="row">
								<div class="col-auto">
									<img
										src={item.item.iconPath}
										alt={item.item.name}
										class="img-fluid"
										style="max-height: 50px; max-width: 50px;"
									/>
								</div>
								<div class="col">
									<h5 style={"color: " + q2c(item.item) + ";"}>{item.item.name}</h5>
								</div>
							</div>
						</ClickableElement>
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
