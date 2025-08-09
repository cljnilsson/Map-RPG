<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import { q2c } from "$lib/utils/itemQuality";
	import { LogController } from "$lib/controller/logs.svelte";

	let offer: number | undefined = $state(undefined);
	let tradeWant: Resource | undefined = $state(undefined);
	let tradeFor: Resource | undefined = $state(undefined);

	function trade() {
		// TODO

		offer = undefined;
		LogController.newLog("You traded resources!");
	}
</script>

<div class="row justify-content-center align-items-center my-5">
	{#each CityController.resources as resource}
		<div class="col-auto">
			<img
				src={resource.iconPath}
				alt={resource.name}
				style="max-width: 30px; max-height: 30px;"
			/>
		</div>
		<div class="col ps-0 text-center">
			<h4 class="mb-0">{resource.amount}</h4>
		</div>
	{/each}
</div>
<div class="row mb-5">
	<div class="col border">
		<div class="row">
			<div class="col-4">
				<div class="row align-items-center my-2">
					{#each CityController.resources as resource}
						<div class="col-auto">
							<img
								class="resource"
								src={resource.iconPath}
								alt={resource.name}
								style="max-width: 40px; max-height: 40px;"
								onclick={() => (tradeFor = resource)}
								class:tradeChoice={resource.name === tradeFor?.name}
							/>
						</div>
					{/each}
				</div>
				<input class="form-control form-control-sm" type="number" bind:value={offer} />
			</div>
			<div class="col-2 border-end">
				<div class="row">
					<div class="col text-center">Rate</div>
				</div>
				<div class="row">
					<div class="col text-center">1.2</div>
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
				<div class="row align-items-center my-2">
					{#each CityController.resources as resource}
						<div class="col-auto">
							<img
								class="resource"
								src={resource.iconPath}
								alt={resource.name}
								style="max-width: 40px; max-height: 40px;"
								onclick={() => (tradeWant = resource)}
								class:tradeChoice={resource.name === tradeWant?.name}
							/>
						</div>
					{/each}
				</div>
				{#if offer}
					{#if tradeWant}
						You get: {Math.floor(offer * 0.8)} {tradeWant.name}
					{:else}
						Pick a resource!
					{/if}
				{/if}
			</div>
		</div>
		<div class="row pt-5 mb-1">
			<div class="col text-center">
				<button class="btn btn-primary" onclick={trade}>Trade</button>
			</div>
		</div>
	</div>
</div>

<style>
	.resource {
		filter: grayscale(70) !important;
	}

	.tradeChoice {
		filter: grayscale(0) !important;
	}
</style>
