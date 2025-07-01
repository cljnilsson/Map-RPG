<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import type { VendorNPC } from "$lib/types/npc";
	import {q2c} from "$lib/utils/itemQuality";

	let { vendor }: { vendor: VendorNPC } = $props();
</script>

<Window height={700} width={480} x={300} y={450} bind:visibility={WindowStore.vendorVisibility}>
	{#snippet title()}
		<h4 class="my-2">{vendor.name}</h4>
	{/snippet}
	{#snippet body()}
		<div class="row">
			{#each vendor.items as item}
				<div class="col-6 px-1 py-1">
					<div class="slot rounded py-1 px-1">
						<div class="row my-1 align-items-stretch">
							<div class="col-auto pe-1">
								<img src={item.iconPath} alt={item.name} />
							</div>
							<div class="col ps-0 d-flex flex-column justify-content-between">
								<div style={"color: " + q2c(item) + ";"}>{item.name}</div>
								<div class="text-end mt-auto">1 2 3</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<p>This vendor sells no items.</p>
			{/each}
		</div>
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style>
	.slot {
		background-color: rgba(50, 50, 50, 0.9);
	}
</style>
