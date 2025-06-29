<script lang="ts">
    import InventoryItem from "$lib/features/inventory/inventoryItem.svelte";
	import type {Item} from "$lib/types/item";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";

	const slots = 14;

	let inventory: Item[] = $state([
		{name: "Box of Eggs", iconPath: "", iconClass: "bi bi-box", amount: 1, description: "A box containing fresh eggs.", quality: "rare"},
		{name: "Blacksmith's Hammer", iconPath: "", iconClass: "bi bi-hammer", amount: 1, description: "A box containing fresh eggs.", quality: "common"},
		{name: "Magical Stone", iconPath: "/items/stone3.jpg", iconClass: "", amount: 3, description: "An unknown black stone with a strange glow.", quality: "epic"},
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
			return "#0070dd"; // Blue
		} else if (i?.quality === "epic") {
			return "#a335ee"; // Purple
		}
		return ""; // Default empty string
	}
</script>

<div class="row justify-content-end">
	<div class="col-xl-5 col-md-6">
		<input type="text" class="form-control mb-3" placeholder="Search inventory..." bind:value={searchString} />
	</div>
</div>
<div class="row gx-2 gy-2">
	{#each [...Array(slots)] as i, index}
		<div class="col-2 d-flex justify-content-center align-items-center">
			{#if inventory[index]}
				<Tooltip>
					{#snippet tooltip()}
						<h5 style={"color: " + q2c(inventory[index]) + ";"}>{inventory[index].name}</h5>
						<p>{inventory[index].description}</p>
					{/snippet}

					<InventoryItem bind:inventory={inventory} item={inventory[index]} currentSearchTerm={searchString} bind:selectedItem={selectedItem} />
				</Tooltip>
			{:else}
				<InventoryItem bind:inventory={inventory} item={inventory[index]} currentSearchTerm={searchString} bind:selectedItem={selectedItem} />
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