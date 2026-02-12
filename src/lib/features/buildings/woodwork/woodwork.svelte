<script lang="ts">
	import type { Building } from "$lib/types/building";
	import type { CraftItem, Quality } from "$lib/types/item";
	import { safeGetItem } from "$lib/data/items";
	import { onMount } from "svelte";
	import Crafting from "$lib/features/buildings/woodwork/crafting.svelte";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();

	let capacity = $derived(20 * level); // Derived instead of state makes sense for this temp implementation.
	let currentWorkers = $state(5); // hardcoded, change later
	let taxIncome = $state(80);
	let quality: Quality = $state("Good");
	const recipes: Array<CraftItem | undefined> = [
		safeGetItem("axe-handle") as CraftItem,
		safeGetItem("bow") as CraftItem,
		safeGetItem("longbow") as CraftItem,
		safeGetItem("recurvebow") as CraftItem,
		safeGetItem("masterwork-longbow") as CraftItem,
		safeGetItem("woodenShield") as CraftItem
	];
	let inspectItem: CraftItem | undefined = $state(undefined);

	onMount(() => {
		const invalid = recipes.includes(undefined);

		if (invalid) {
			console.error("Craft item list has at least one invalid id reference which is undefined.");
		}

		if (recipes.length > 0) {
			inspectItem = recipes[0];
		}
	});

	$effect(() => {
		if (level >= 1 && level < 5) {
			quality = "Poor";
		} else if (level >= 5 && level < 10) {
			quality = "Good";
		} else if (level >= 10) {
			quality = "Excellent";
		} else if (level >= 20) {
			quality = "Perfect";
		}
	});
</script>

<div class="row my-5">
	<div class="col border mx-2 bg">
		<ul class="my-2">
			<li>Capacity: <span class="fw-bold">{capacity}</span></li>
			<li>
				Tax income: <span
					><img src="/items/coin3.jpg" width={16} height={16} class="me-1" alt="Golden coin with black background" /></span
				><span class="fw-bold">{taxIncome}/h</span>
			</li>
			<li>
				Average outut quality: <span
					class="badge"
					class:text-bg-success={quality === "Excellent"}
					class:text-bg-warning={quality === "Good"}
					class:text-bg-danger={quality === "Poor"}>{quality}</span
				>
			</li>
		</ul>
		<Crafting {level} {currentWorkers} {recipes} bind:inspectItem />
	</div>
</div>

<style>
	.bg {
		background-color: rgba(10, 10, 10, 0.2);
	}
</style>
