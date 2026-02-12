<script lang="ts">
	import type { CraftItem, Quality } from "$lib/types/item";
	import { safeGetItem } from "$lib/data/items";
	import { safeGetResource } from "$lib/data/resources";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let {
		inspectItem = $bindable(),
		level,
		currentWorkers,
		recipes
	}: { inspectItem: CraftItem | undefined; level: number; currentWorkers: number; recipes: Array<CraftItem | undefined> } = $props();

	function qualityToNumber(toConvert: Quality | false): number {
		let toReturn: number = 0;

		switch (toConvert) {
			case false: // Unsure if I should return 0 or 1 but either way it shouldn't be too critical.
			case "Poor":
				toReturn = 1;
				break;
			case "Good":
				toReturn = 2;
				break;
			case "Excellent":
				toReturn = 3;
				break;
			case "Perfect":
				toReturn = 4;
				break;
		}

		return toReturn;
	}

	function onCraftConfirm() {
		if (!inspectItem) {
			console.warn("Trying to craft without item selected");
			return;
		}
		// Quality goes from 1-100
		const avgComponentQuality: number =
			inspectItem.components.reduce((tv, cv) => tv + qualityToNumber(cv.requiredQuality), 0) / inspectItem.components.length;
		const randomFactor = 5; // todo
		let quality: number = 1 + avgComponentQuality + level + currentWorkers + randomFactor;

		if (quality > 100) {
			quality = 100;
		}

		console.log(`Item would be crafted with quality: ${quality}`);
	}
</script>

<div class="row py-5 px-3">
	<div class="col-4 border craftInfo recipeList">
		{#each recipes as r, i (i)}
			{#if r}
				<div class="row">
					<div class="col recipe-entry" class:selected={r.id === inspectItem?.id}>
						<ClickableElement onClickCallback={() => (inspectItem = r)}>
							<div>
								<img src={r.iconPath} width={16} height={16} class="me-1" alt={r.description} /><span>{r.name}</span>
							</div>
						</ClickableElement>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<div class="col-8 border py-3 craftInfo">
		{#if inspectItem}
			<h5>
				<img src={inspectItem.iconPath} width={64} height={64} class="me-2" alt={inspectItem.description} /><span
					>{inspectItem.name}</span
				>
			</h5>
			<p class="mb-0">{inspectItem.description}</p>
			{#each inspectItem.components as c}
				{@const i = safeGetItem(c.item)}
				{#if i}
					{c.quantity}x {i.name}
				{:else}
					Invalid item id, report it!
				{/if}
			{/each}
			{#each inspectItem.resourceCosts as c}
				{@const r = safeGetResource(c.resource)}
				{#if r}
					<img src={r.iconPath} alt={r.name} width={48} height={48} />{c.amount}x {r.name}
				{:else}
					Invalid resource id, report it!
				{/if}
			{/each}
		{/if}
	</div>
</div>
<div class="text-end py-2">
	<button class="btn btn-primary" onclick={onCraftConfirm}>Craft</button>
</div>

<style>
	.recipe-entry {
		transition: all 0.15s ease-in-out;
	}

	.recipe-entry:hover {
		background: linear-gradient(
			to right,
			rgba(255, 140, 0, 0) 0%,
			rgba(30, 30, 30, 0.5) 15%,
			rgba(30, 30, 30, 0.35) 65%,
			rgba(255, 140, 0, 0) 90%
		);
	}

	.selected {
		background: linear-gradient(
			to right,
			rgba(255, 140, 0, 0) 0%,
			rgba(255, 160, 0, 0.5) 15%,
			rgba(255, 120, 0, 0.35) 65%,
			rgba(255, 140, 0, 0) 90%
		);
	}

	.craftInfo {
		color: #685247;
		background-color: #e3c9b2;
	}

	.recipeList {
		/* Should add scroll hopefully */
		max-height: 15rem;
		overflow-y: auto;
	}
</style>
