<script lang="ts">
import { CityController } from "$lib/controller/city.svelte";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import type { Resource, BaseResource } from "$lib/types/resource";
import ClickableElement from "$lib/components/utils/clickableElement.svelte";

let { selectedResource = $bindable() }: { selectedResource: Resource | BaseResource | undefined } = $props();
</script>

<div class="row align-items-center my-2">
	{#each CityController.resources as resource, i (resource)}
		<div
			class="col-4 my-1
				{i % 3 === 1 ? ' text-center' : ''}
				{i % 3 === 2 ? ' text-end' : ''}"
		>
			<ClickableElement onClickCallback={() => (selectedResource = resource)}>
				<Tooltip>
					{#snippet onHoverTooltip()}
						<h5 class="my-1">{resource.name}</h5>
					{/snippet}
					<img
						class="resource"
						src={resource.iconPath}
						alt={resource.name}
						style="max-width: 40px; max-height: 40px;"
						class:tradeChoice={resource.name === selectedResource?.name}
					/>
				</Tooltip>
			</ClickableElement>
		</div>
	{/each}
</div>

<style>
	.resource {
		filter: grayscale(70) !important;
	}

	.tradeChoice {
		filter: grayscale(0) !important;
	}
</style>
