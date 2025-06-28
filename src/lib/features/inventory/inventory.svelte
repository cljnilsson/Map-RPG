<script lang="ts">
    import InventoryItem from "$lib/features/inventory/inventoryItem.svelte";
	import type {Item} from "$lib/types/item";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";

	const slots = 14;

	let inventory: Item[] = $state([
		{name: "Box of Eggs", iconPath: "", iconClass: "bi bi-box", amount: 1, description: "A box containing fresh eggs.", quality: "rare"},
		{name: "Blacksmith's Hammer", iconPath: "", iconClass: "bi bi-hammer", amount: 1, description: "A box containing fresh eggs.", quality: "common"},
	]);

	let selectedItem: Item | null = $state(null);
	let searchString: string = $state("");

	$effect(() => {
		$inspect(selectedItem);
	});

	function q2c(i: Item): string {
		if (i?.quality === "common") {
			return "#FFFFFF"; // White
		} else if (i?.quality === "rare") {
			return "#0000FF"; // Blue
		} else if (i?.quality === "epic") {
			return "#800080"; // Purple
		}
		return ""; // Default empty string
	}
</script>
<div class="row justify-content-end">
	<div class="col-xl-2 col-md-4">
		<input type="text" class="form-control mb-3" placeholder="Search inventory..." bind:value={searchString} />
	</div>
</div>
<div class="row gx-4 gy-4">
	{#each [...Array(slots)] as i, index}
		<div class="col-1">
			{#if inventory[index]}
				<Tooltip>
					{#snippet tooltip()}
						<h5 style={"color: " + q2c(inventory[index]) + ";"}>{inventory[index].name}</h5>
						<p>{inventory[index].description}</p>
					{/snippet}

					<InventoryItem bind:inventory={inventory} item={inventory[index]} bind:selectedItem={selectedItem} />
				</Tooltip>
			{:else}
				<InventoryItem bind:inventory={inventory} item={inventory[index]} bind:selectedItem={selectedItem} />
			{/if}
		</div>
	{/each}
</div>
<div class="row justify-content-end">
	<div class="col-xl-2 text-end">
		<img src="/items/coin1.jpg" alt="Copper coin" height="18"/>1
		<img src="/items/coin2.jpg" alt="Copper coin" height="18"/>2
		<img src="/items/coin3.jpg" alt="Copper coin" height="18"/>3
	</div>
</div>