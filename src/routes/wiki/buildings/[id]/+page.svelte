<script lang="ts">
	import ResourceCost from "$lib/components/resourceCost.svelte";
	import type { Building } from "$lib/types/building";

	import { safeGetBuilding } from "$lib/data/buildings";

    const { data } = $props();
    const building: Building | undefined = $derived(safeGetBuilding(data.building));
</script>

<div class="container mt-3 px-5">
    {#if building}
        <h3>{building.name}</h3>
        <div class="row">
           	<div class="col-auto">
           	    <img src={building.artPath} height={200} width={200} alt={"The " + building.name + " building"} />
           	</div>
           	<div class="col">
                <p>Plot type: {building.plotType}</p>
           	    <p>{building.description}</p>
                {#if building.cost.length > 0}
					<ResourceCost costs={building.cost} level={1} />
				{/if}
           	</div>
        </div>
    {/if}
</div>

<style lang="scss">
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
