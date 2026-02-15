<script lang="ts">
import type { InventoryItem } from "$lib/types/item";
import { safeGetItem } from "$lib/data/items";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import ItemGrid from "$lib/components/itemGrid.svelte";
import { onMount } from "svelte";
import { getStorages, getStorage } from "$lib/api/storage.remote";
import StorageController from "$lib/controller/storage.svelte";
import { q2c } from "$lib/utils/itemQuality";
import StorageItemComponent from "$lib/features/buildings/bank/storageItem.svelte";

let { cityDataId }: { cityDataId: number } = $props();

let searchString = $state("");

const slots = StorageController.inventorySize;

onMount(async () => {
	const storageAll = await getStorages();
	const getMyStorage = await getStorage({
		cityId: cityDataId,
	});
	console.log(storageAll, getMyStorage);
	if (getMyStorage) {
		StorageController.inventory = getMyStorage.map((storageItem) => {
			const baseItem = safeGetItem(storageItem.itemKey);

			if (!baseItem) {
				throw Error("Item from DB does not match existing client options.");
			}

			return {
				item: baseItem,
				amount: storageItem.amount,
			};
		});
	}
});
</script>

<ItemGrid items={StorageController.inventory} size={slots}>
	{#snippet item(gridItem: InventoryItem)}
		<Tooltip>
			{#snippet onHoverTooltip()}
				<h5 style={"color: " + q2c(gridItem.item) + ";"}>{gridItem.item.name}</h5>
				<p>{gridItem.item.description}</p>
			{/snippet}

			<StorageItemComponent
				bind:inventory={StorageController.inventory}
				item={gridItem}
				currentSearchTerm={searchString}
				{cityDataId}
			/>
		</Tooltip>
	{/snippet}
</ItemGrid>
