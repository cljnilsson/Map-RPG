<script lang="ts">
	import type { Building } from "$lib/types/building";
	import type { CraftItem } from "$lib/types/item";
	import { safeGetItem } from "$lib/data/items";
	import { onMount } from "svelte";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();

	let capacity = $derived(20 * level); // Derived instead of state makes sense for this temp implementation.
	let taxIncome = $state(80);
	let quality: "Bad" | "Good" | "Excelent" = $state("Good");
	let resourceRequirement: "Low" | "Medium" | "High" = $state("Low");
	const recipes: Array<CraftItem | undefined> = [safeGetItem("axe-handle") as CraftItem, safeGetItem("axe-head") as CraftItem];
	let inspectItem: CraftItem | undefined = $state(undefined);

	onMount(() => {
		const invalid = recipes.includes(undefined);

		if (invalid) {
			console.error("Craft item list has at least one invalid id reference which is undefined.");
		}
	});

	$effect(() => {
		if (level >= 1 && level < 5) {
			quality = "Bad";
			resourceRequirement = "Low";
		} else if (level >= 5 && level < 10) {
			quality = "Good";
			resourceRequirement = "Medium";
		} else if (level >= 10) {
			quality = "Excelent";
			resourceRequirement = "High";
		}
	});

	function onCraftConfirm() {
		// Todo
	}
</script>

<div class="row my-5">
	<div class="col border mx-2">
		<ul class="my-2">
			<li>Capacity: <span class="fw-bold">{capacity}</span></li>
			<li>
				Tax income: <span
					><img src="/items/coin3.jpg" width={16} height={16} class="me-1" alt="Golden coin with black background" /></span
				><span class="fw-bold">{taxIncome}/h</span>
			</li>
			<li>
				Food & Drink quality: <span
					class="badge"
					class:text-bg-success={quality === "Excelent"}
					class:text-bg-warning={quality === "Good"}
					class:text-bg-danger={quality === "Bad"}>{quality}</span
				>
			</li>
			<li>
				Buying resources from market: <span
					class="badge"
					class:text-bg-success={resourceRequirement === "High"}
					class:text-bg-warning={resourceRequirement === "Medium"}
					class:text-bg-danger={resourceRequirement === "Low"}>{resourceRequirement}</span
				>
			</li>
		</ul>
		<div class="row py-5">
			<div class="col-4">
				{#each recipes as r, i (i)}
					{#if r}
						<div class="row">
							<div class="col" onclick={() => (inspectItem = r)}>
								<img src={r.iconPath} width={16} height={16} class="me-1" alt={r.description} /><span>{r.name}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
			<div class="col-8 bg-dark text-light">
				{#if inspectItem}
					<h5>
						<img src={inspectItem.iconPath} width={24} height={24} class="me-2" alt={inspectItem.description} /><span
							>{inspectItem.name}</span
						>
					</h5>
					<p>{inspectItem.description}</p>
					{#each inspectItem.components as c}
						{@const i = safeGetItem(c.item)}
						{#if i}
							{c.quantity}x {i.name}
						{:else}
							Invalid item id, report it!
						{/if}
					{/each}
				{/if}
			</div>
		</div>
		<div class="text-end py-2">
			<button class="btn btn-primary" onclick={onCraftConfirm}>Craft</button>
		</div>
	</div>
</div>
