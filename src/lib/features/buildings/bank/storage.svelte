<script lang="ts">
	import type { InventoryItem } from "$lib/types/item";
	import { getItem } from "$lib/data/items";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Building } from "$lib/types/building";
	import ItemGrid from "$lib/components/itemGrid.svelte";
	import { onMount } from "svelte";
	import { getStorages, getStorage } from "$lib/api/storage.remote";

	let { cityDataId }: { cityDataId: number } = $props();

	const rows = 8;
	const slots = 6 * rows;
	let arrayDemo: InventoryItem[] = $state([]);

	onMount(async () => {
		const storageAll = await getStorages();
		const getMyStorage = await getStorage({
			cityId: 1
		});
		console.log(storageAll, getMyStorage);
	});
</script>

<ItemGrid items={arrayDemo} size={slots}>
	{#snippet item(test: InventoryItem)}
		{test.amount}
	{/snippet}
</ItemGrid>
