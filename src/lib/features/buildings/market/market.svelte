<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import { LogController } from "$lib/controller/logs.svelte";
	import ResourceSelection from "$lib/features/buildings/market/resourceSelection.svelte";

	let offer = $state<number | undefined>(undefined);
	let tradeFor = $state<Resource | undefined>(undefined);
	let tradeWant = $state<Resource | undefined>(undefined);

	let valuesAreSet = $derived(offer !== undefined && tradeFor !== undefined);
	let canAfford: boolean = $derived(valuesAreSet && (tradeFor?.amount ?? 0) > (offer ?? 0));

	let rate: number = $state(1.2);

	function trade() {
		if(!valuesAreSet || !canAfford) {
			return;
		}

		if(tradeFor && tradeWant && offer) {
			const success = CityController.pay([{...tradeFor, amount: offer}]);

			if(success) {
				CityController.give([{...tradeWant, amount: Math.floor(offer * (2 - rate))}]);

				offer = undefined;
				LogController.newLog("You traded resources!");
			}
		}
	}
</script>

<div class="row justify-content-center align-items-center my-5">
	{#each CityController.resources as resource}
		<div class="col-auto">
			<Tooltip>
				{#snippet tooltip()}
					<h5 class="my-1">{resource.name}</h5>
				{/snippet}
				<img src={resource.iconPath} alt={resource.name} style="max-width: 30px; max-height: 30px;" />
			</Tooltip>
		</div>
		<div class="col ps-0 text-center">
			<h4 class="mb-0">{resource.amount}</h4>
		</div>
	{/each}
</div>
<div class="row mb-5">
	<div class="col border">
		<div class="row">
			<!--Extends col border -->
			<div class="col-4 mb-4">
				<ResourceSelection bind:selectedResource={tradeFor} />
				<input
					class="form-control form-control-s"
					class:is-invalid={valuesAreSet && !canAfford}
					type="number"
					bind:value={offer}
					placeholder="Amount"
				/>
			</div>
			<div class="col-2 border-end">
				<div class="row">
					<div class="col text-center">Rate</div>
				</div>
				<div class="row">
					<div class="col text-center">{rate}</div>
				</div>
			</div>
			<div class="col-2">
				<div class="row">
					<div class="col text-center">Merchants</div>
				</div>
				<div class="row">
					<div class="col text-center">1</div>
				</div>
			</div>
			<div class="col-4">
				<ResourceSelection bind:selectedResource={tradeWant} />
				{#if offer}
					{#if tradeWant}
						You get: <b>{Math.floor(offer * (2 - rate))}</b> {tradeWant.name}
					{:else}
						Pick a resource!
					{/if}
				{/if}
			</div>
		</div>
		<div class="row my-1">
			<div class="col text-center">
				<button class="btn btn-primary" onclick={trade}>Trade</button>
			</div>
		</div>
	</div>
</div>
