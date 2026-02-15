<script lang="ts">
import { CityController } from "$lib/controller/city.svelte";
import Tooltip from "$lib/features/tooltip/tooltip.svelte";
import type { Resource } from "$lib/types/resource";
import LogController from "$lib/controller/logs.svelte";
import type { Building } from "$lib/types/building";

const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();
let max = $state(5);
let combat = $state(1);
let merchant = $state(2);
let travel = $state(1);
let current = $derived(combat + merchant + travel);
let available = $derived(max - current);
</script>

<div class="row justify-content-center align-items-center my-5">
	{#each CityController.resources as resource (resource.name)}
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

<div class="row justify-content-center">
	<div class="col-4">Available</div>
	<div class="col-2">
		{available}
	</div>
</div>
<div class="row justify-content-center">
	<div class="col-4">Merchant ship(s)</div>
	<div class="col-2">
		{merchant}
	</div>
</div>
<div class="row justify-content-center">
	<div class="col-4">Travel ship(s)</div>
	<div class="col-2">
		{travel}
	</div>
</div>
<div class="row justify-content-center">
	<div class="col-4">Combat ship(s)</div>
	<div class="col-2">
		{combat}
	</div>
</div>
<div class="row justify-content-center">
	<div class="col-4">Total</div>
	<div class="col-2">
		{current}
	</div>
</div>
