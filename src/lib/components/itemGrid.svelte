<script lang="ts" generics="T">
	import type { Snippet } from "svelte";

	interface Props {
		item: Snippet<[T]>;
		items: T[];
		size: number;
	}

	let { item, items, size }: Props = $props();
	let array: number[] = $derived([...Array(size)]);
	/*
		HTML is a bit ugly and unfinished but leaving it for now while manually seeing if it breaks as time goes before optimizing it.
	*/
</script>

<div class="row gx-2 gy-2">
	{#each array as _, index (index)}
		{#if items[index]}
			<div class="col-2 d-flex justify-content-center align-items-center">
				<div class="border" style="min-width: 64px; min-height: 64px;">
					{@render item(items[index])}
				</div>
			</div>
		{:else}
			<div class="col-2 d-flex justify-content-center align-items-center">
				<div class="border" style="min-width: 64px; min-height: 64px;"></div>
			</div>
		{/if}
	{/each}
</div>
