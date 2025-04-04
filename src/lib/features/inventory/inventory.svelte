<script lang="ts">
    import InventoryItem from "$lib/features/inventory/inventoryItem.svelte";
	import type {Item} from "$lib/types/item";

	const slots = 14;
	let inventory: Item[] = $state([
		{name: "Box of Eggs", iconPath: "", iconClass: "bi bi-box"},
		{name: "Blacksmith's Hammer", iconPath: "", iconClass: "bi bi-hammer"},
	]);
</script>

<div class="row gx-4 gy-4">
	{#each [...Array(slots)] as i, index}
		<InventoryItem bind:inventory={inventory} item={inventory[index]}></InventoryItem>
	{/each}
</div>