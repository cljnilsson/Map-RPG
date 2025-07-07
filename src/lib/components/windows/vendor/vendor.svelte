<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import type { VendorNPC } from "$lib/types/npc";
	import { q2c } from "$lib/utils/itemQuality";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Item } from "$lib/types/item";
	import { PlayerController } from "$lib/controller/character.svelte";

	let { vendor }: { vendor: VendorNPC } = $props();

	function buyItem(item: Item) {
		console.log("Trying to buy :(");
		PlayerController.giveItem(item);
	}
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
						<Tooltip>
							{#snippet tooltip()}
								<h5 style={"color: " + q2c(item) + ";"}>{item.name}</h5>
								<p>{item.description}</p>
							{/snippet}
							<div class="row my-1 align-items-stretch" onclick={() => buyItem(item)}>
								<div class="col-auto pe-1">
									<img src={item.iconPath} alt={item.name} />
								</div>
								<div class="col ps-0 d-flex flex-column justify-content-between">
									<div style={"color: " + q2c(item) + ";"}>{item.name}</div>
									<div class="row justify-content-end money mt-2">
										<div class="col-auto d-flex align-items-center">
											<img src="/items/coin1.jpg" alt="Copper coin" height="20" /> <span class="coin-text">{1}</span>
											<img src="/items/coin2.jpg" alt="Silver coin" height="20" /> <span class="coin-text">{2}</span>
											<img src="/items/coin3.jpg" alt="Gold coin" height="20" /> <span class="coin-text">{3}</span>
										</div>
									</div>
								</div>
							</div>
						</Tooltip>
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

<style lang="scss">
	.slot {
		background-color: rgba(50, 50, 50, 0.9);
	}
</style>
