<script lang="ts">
	import MapStore from "$lib/stores/map.svelte";
    import { getBuildingsByPlotType } from "$lib/data/buildings";

	console.log(MapStore.currentMapState);

    const buildings = getBuildingsByPlotType("default");
</script>

<div class="map-wrapper mt-3 px-3 mx-5">
	{#if MapStore.currentMapState}
		{#each buildings as buildingOption}
            <div class="row my-3">
                <div class="col">
                    <h4>{buildingOption.name}</h4>
                </div>
            </div>
            <div class="row">
                <div class="col-auto">
                    <img src={buildingOption.artPath} alt={"image of the building " + buildingOption.name} width={100} height={100}>
                </div>
                <div class="col-8">
                    <p>{buildingOption.description}</p>
                </div>
            </div>
        {/each}
	{/if}
</div>

<style>
	.map-wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
