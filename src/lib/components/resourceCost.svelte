<script lang="ts">
import type { Resource } from "$lib/types/resource";
import { CityController } from "$lib/controller/city.svelte";
import { costToNextLevel } from "$lib/utils/cost";

let { costs, level = 1 }: { costs: Resource[]; level?: number } = $props();
</script>

<div class="row justify-content-center align-items-center py-3">
	<div class="col-auto px-3 py-3 border resources">
		{#each costs as resource (resource.name)}
			{@const matchingCityResource = CityController.getResource(resource.name)}
			<div
				class="resource d-inline-flex align-items-center border-bottom border-4"
				class:border-danger={matchingCityResource.amount < resource.amount}
				class:border-success={matchingCityResource.amount >= resource.amount}
			>
				<img src={resource.iconPath} alt={"icon of " + resource.name} loading="lazy" />
				{#if level > 1}
					<span>{costToNextLevel(resource.amount, level)}</span>
				{:else}
					<span>{resource.amount}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
    .resources {
        background-color: rgba(10, 10, 10, 0.2);
    }

	.resources .resource {
		font-size: 24px;
		gap: 0.25rem;
		margin-right: 1rem; /* same as me-3 */
		display: inline-flex;
		align-items: center;
	}

	.resources .resource:last-child {
		margin-right: 0; /* Remove gap from last */
	}

	.resources .resource img {
		width: 24px;
		height: 24px;
		display: block; /* removes inline gap */
	}
</style>
