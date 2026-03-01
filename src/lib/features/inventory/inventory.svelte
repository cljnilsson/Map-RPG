<script lang="ts">
import { PlayerController } from "$lib/controller/character.svelte";
import InventoryItemComponent from "$lib/features/inventory/inventoryItem.svelte";
import type { InventoryItem } from "$lib/types/item";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import { q2c } from "$lib/utils/itemQuality";
import ItemGrid from "$lib/components/itemGrid.svelte";

let {
	title = "",
	showEmptySlots = true,
	showMoney = true,
	mode = "Normal",
	cityDataId = -1,
}: {
	title?: string;
	showEmptySlots?: boolean;
	showMoney?: boolean;
	mode?: "Normal" | "Bank";
	cityDataId?: number;
} = $props();

const rows = 8;
const slots = 6 * rows;

let selectedItem: InventoryItem | null = $state(null);
let searchString: string = $state("");
let size: number = $derived(showEmptySlots ? slots : PlayerController.inventory.length);

$effect(() => {
	$inspect(selectedItem);
});
</script>

<div class="row align-items-center pb-3">
	{#if title.length > 0}
		<div class="col text-start ps-4">
			<h5 class="mb-0">{title}</h5>
		</div>
	{/if}
	<div class="col d-flex justify-content-end pe-4">
		<input type="text" class="form-control w-auto" placeholder="Search inventory..." bind:value={searchString} />
	</div>
</div>
<ItemGrid items={PlayerController.inventory} {size}>
	{#snippet item(gridItem)}
		<Tooltip>
			{#snippet onHoverTooltip()}
				<h5 style={"color: " + q2c(gridItem.item) + ";"}>{gridItem.item.name}</h5>
				<p>{gridItem.item.description}</p>
			{/snippet}

			<InventoryItemComponent
				bind:inventory={PlayerController.inventory}
				item={gridItem}
				currentSearchTerm={searchString}
				bind:selectedItem
				{mode}
				{cityDataId}
			/>
		</Tooltip>
	{/snippet}
</ItemGrid>

{#if showMoney}
	<div class="row justify-content-end money mt-2">
		<div class="col-auto d-flex align-items-center">
			<img src="/items/coin1.jpg" alt="Copper coin" height="24" />
			<span class="coin-text">{PlayerController.money.copper}</span>
			<img src="/items/coin2.jpg" alt="Silver coin" height="24" />
			<span class="coin-text">{PlayerController.money.silver}</span>
			<img src="/items/coin3.jpg" alt="Gold coin" height="24" /> <span class="coin-text">{PlayerController.money.gold}</span>
		</div>
	</div>
{/if}

<style>
	.money {
		color: white;
	}

	.coin-text {
		font-family: "Arial", sans-serif; /* Match font style to complement the coin images */
		font-size: 24px; /* Adjust size to align visually with the coin images */
		margin-right: 0.6rem;
	}
</style>
