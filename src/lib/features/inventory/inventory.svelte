<script lang="ts">
	import CharacterStore from "$lib/stores/character.svelte";
	import InventoryItem from "$lib/features/inventory/inventoryItem.svelte";
	import type { Item } from "$lib/types/item";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import {q2c} from "$lib/utils/itemQuality";

	const rows = 8;
	const slots = 6 * rows;

	let selectedItem: Item | null = $state(null);
	let searchString: string = $state("");

	$effect(() => {
		$inspect(selectedItem);
	});
</script>

<div class="row justify-content-end">
	<div class="col-xl-5 col-md-6">
		<input type="text" class="form-control mb-3" placeholder="Search inventory..." bind:value={searchString} />
	</div>
</div>
<div class="row gx-2 gy-2">
	{#each [...Array(slots)] as i, index}
		{@const inventory = CharacterStore.inventory}
		<div class="col-2 d-flex justify-content-center align-items-center">
			{#if inventory[index]}
				<Tooltip>
					{#snippet tooltip()}
						<h5 style={"color: " + q2c(inventory[index]) + ";"}>{inventory[index].name}</h5>
						<p>{inventory[index].description}</p>
					{/snippet}

					<InventoryItem
						bind:inventory={CharacterStore.inventory}
						item={inventory[index]}
						currentSearchTerm={searchString}
						bind:selectedItem
					/>
				</Tooltip>
			{:else}
				<InventoryItem
					bind:inventory={CharacterStore.inventory}
					item={inventory[index]}
					currentSearchTerm={searchString}
					bind:selectedItem
				/>
			{/if}
		</div>
	{/each}
</div>
<div class="row justify-content-end money mt-2">
	<div class="col-auto d-flex align-items-center">
		<img src="/items/coin1.jpg" alt="Copper coin" height="24" /> <span class="coin-text">{CharacterStore.character.money.copper}</span>
		<img src="/items/coin2.jpg" alt="Silver coin" height="24" /> <span class="coin-text">{CharacterStore.character.money.silver}</span>
		<img src="/items/coin3.jpg" alt="Gold coin" height="24" /> <span class="coin-text">{CharacterStore.character.money.gold}</span>
	</div>
</div>

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