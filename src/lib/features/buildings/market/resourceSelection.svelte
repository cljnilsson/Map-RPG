<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import { q2c } from "$lib/utils/itemQuality";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let { selectedResource = $bindable() }: { selectedResource: Resource | undefined } = $props();
</script>

<div class="row align-items-center my-2">
	{#each CityController.resources as resource}
		<div class="col-auto">
			<ClickableElement onClickCallback={() => (selectedResource = resource)}>
				<img
					class="resource"
					src={resource.iconPath}
					alt={resource.name}
					style="max-width: 40px; max-height: 40px;"
					class:tradeChoice={resource.name === selectedResource?.name}
				/>
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
