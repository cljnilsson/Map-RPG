<script lang="ts">
import type { CraftItem, Quality } from "$lib/types/item";
import CraftingMenu from "$lib/features/buildings/woodwork/craftingMenu.svelte";
import CraftingItem from "$lib/features/buildings/woodwork/craftingItem.svelte";

let {
	inspectItem = $bindable(),
	level,
	currentWorkers,
	recipes,
}: {
	inspectItem: CraftItem | undefined;
	level: number;
	currentWorkers: number;
	recipes: Array<CraftItem | undefined>;
} = $props();

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

function generateRandomFactor(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onCraftConfirm() {
	if (!inspectItem) {
		console.warn("Trying to craft without item selected");
		return;
	}
	// Quality goes from 1-100
	let avgComponentQuality: number;

	if (inspectItem.components.length > 0) {
		avgComponentQuality =
			inspectItem.components.reduce(
				(tv, cv) => tv + qualityToNumber(cv.requiredQuality),
				0,
			) / inspectItem.components.length;
	} else {
		avgComponentQuality = 0;
	}
	const randomFactor = generateRandomFactor(-5, 5);
	let quality: number =
		1 + avgComponentQuality + level + currentWorkers + randomFactor;
	console.log(avgComponentQuality, level, currentWorkers, randomFactor);

	if (quality > 100) {
		quality = 100;
	}

	console.log(`Item would be crafted with quality: ${quality}`);
}
</script>

<div class="row my-5 mx-3 shadow">
	<div class="col-4 py-2 px-0 border craftInfo">
	    <CraftingMenu {recipes} bind:inspectItem />
	</div>
	<div class="col-8 border py-2 craftInfo">
	    <CraftingItem bind:inspectItem />
	</div>
</div>
<div class="text-end py-2">
	<button type="button" class="btn btn-primary" onclick={onCraftConfirm}>Craft</button>
</div>

<style>
	.craftInfo {
		color: #685247;
		background-color: #e3c9b2;
	}
</style>
