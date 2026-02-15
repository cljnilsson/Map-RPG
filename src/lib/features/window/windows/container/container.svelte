<script lang="ts">
import Window from "$lib/features/window/window.svelte";
import WindowController from "$lib/controller/window.svelte";
import { q2c } from "$lib/utils/itemQuality";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import type { InventoryItem } from "$lib/types/item";
import { PlayerController } from "$lib/controller/character.svelte";
import ClickableElement from "$lib/components/utils/clickableElement.svelte";
import ContainerStore from "$lib/stores/container.svelte";

let baseHeight = 100;
let perItemHeight = 64;
let totalHeight = $derived((ContainerStore.object?.contains ?? []).length * perItemHeight + baseHeight); // Flawed calculation, put more thought into this later, set a max height at some point

function onClick(item: InventoryItem) {
	if (!ContainerStore.object) {
		return; // No container object, nothing to do
	}

	if (ContainerStore.object.contains.findIndex((i) => i.item.id === item.item.id) === -1) {
		console.warn("Item not found in container:", item);
		return; // Item not found in the container, nothing to do
	}

	const worked = PlayerController.giveItem(item.item);
	if (worked) {
		ContainerStore.object.contains = ContainerStore.object.contains.filter((i) => i.item.id !== item.item.id);
	}
}

let containerWindow = WindowController.getByName("Container");
</script>

<Window
	uniqueKey="Container"
	height={totalHeight}
	width={380}
	x={containerWindow.x}
	y={containerWindow.y}
	bind:visibility={containerWindow.visible}
>
	{#snippet title()}
		<h4 class="my-2">{ContainerStore.object?.name}</h4>
	{/snippet}
	{#snippet body()}
		{#each ContainerStore.object?.contains ?? [] as item}
			<Tooltip>
				{#snippet onHoverTooltip()}
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
