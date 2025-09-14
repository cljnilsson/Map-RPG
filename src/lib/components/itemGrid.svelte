<script lang="ts" generics="T">
	import type { Snippet } from "svelte";
	import type { InventoryItem } from "$lib/types/item";
	import { q2c } from "$lib/utils/itemQuality";

	interface Props {
		item: Snippet<[T]>;
		items: T[];
		size: number;
	}

	let { item, items, size }: Props = $props();
	let array: number[] = $derived([...Array(size)]);

	function isInventoryItem(value: unknown): value is InventoryItem {
		return typeof value === "object" && value !== null && "item" in value && "amount" in value;
	}
</script>

<div class="row gx-2 gy-2">
	{#each array as _, index (index)}
		{@const color = isInventoryItem(items[index]) ? "border-color: " + q2c(items[index].item) + "!important;" : ""}
		<div class="col-2 d-flex justify-content-center align-items-center">
			<div class="border" style={color}>
				{#if items[index]}
					{@render item(items[index])}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.border {
		min-width: 64px;
		min-height: 64px;
		background-color: rgba(100, 100, 100, 0.3);
	}
</style>
