<script lang="ts">
	import { getAllBuildings } from "$lib/data/buildings";
	import { getAllQuests } from "$lib/data/quests";
	import { getAllItems } from "$lib/data/items";
	import { getAllResources } from "$lib/data/resources";
	import { getAllUnits } from "$lib/data/units";
	import MapController from "$lib/controller/map.svelte";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let mode: "none" | "buildings" | "quests" | "units" | "items" | "resources" | "cities" = $state("none");

	// todo
	// resources of a map does not seem to be loaded unless the map is visited.
</script>

<div class="container mt-3">
	<div class="row justify-content-center">
		<div class="col-auto">
			<h1>Wiki</h1>
		</div>
	</div>
	<div class="row">
		<div class="col-auto">
			<div class="bg-light rounded-end p-3">
				<h3>Shortcuts</h3>
				<ClickableElement onClickCallback={() => (mode = "buildings")}>Buildings</ClickableElement>
				<ClickableElement onClickCallback={() => (mode = "units")}>Units</ClickableElement>
				<ClickableElement onClickCallback={() => (mode = "items")}>Items</ClickableElement>
				<ClickableElement onClickCallback={() => (mode = "quests")}>Quests</ClickableElement>
				<ClickableElement onClickCallback={() => (mode = "resources")}>Resources</ClickableElement>
				<ClickableElement onClickCallback={() => (mode = "cities")}>Cities</ClickableElement>
			</div>
		</div>
		<div class="col">
		    <h3>{mode !== "none" ? mode : ""}</h3>
			{#if mode === "buildings"}
				{#each getAllBuildings().sort((a, b) =>  a.name.localeCompare(b.name)) as building (building.id)}
					<div>
					    <a href="/wiki/buildings/{building.id}">{building.name}</a>
					</div>
				{/each}
			{:else if mode === "quests"}
				{#each getAllQuests().sort((a, b) =>  a.title.localeCompare(b.title)) as quest (quest.id)}
                    <div class="row">
                        <div class="col">
                            <h3>{quest.title}</h3>
                            <p>{quest.description}</p>
                        </div>
                    </div>
				{/each}
			{:else if mode === "units"}
				{#each getAllUnits().sort((a, b) =>  a.name.localeCompare(b.name)) as unit (unit.id)}
					<div>{unit.name}</div>
				{/each}
			{:else if mode === "items"}
				{#each getAllItems().sort((a, b) =>  a.name.localeCompare(b.name)) as item (item.id)}
					<div>{item.name}</div>
				{/each}
			{:else if mode === "resources"}
				{#each getAllResources().sort((a, b) =>  a.name.localeCompare(b.name)) as resource (resource.name)}
                <div class="row">
                    <div class="col-auto">
                        <img src={resource.iconPath} alt={resource.name} width="32" height="32" />
                    </div>
                    <div class="col">
                        {resource.name}
                    </div>
                </div>
				{/each}
			{:else if mode === "cities"}
                {#each MapController.cities.sort((a, b) =>  a.name.localeCompare(b.name)) as city (city.name)}
                    <div class="my-3 p-2 bg-light rounded">
                        <div class="row">
                           	<div class="col">
                               	<h5>{city.name}</h5>
                           	</div>
                        </div>
                        <div class="row">
                           	<div class="col-6 col-xl-2">
       	                        <div class="row">
                                   	<div class="col-auto">
                                        Pop
                                   	</div>
                                    <div class="col text-end">
                                        {city.city.population}
                                    </div>
                                </div>
                                <div class="row">
                                   	<div class="col-auto">
                                        Type
                                   	</div>
                                    <div class="col text-end">
                                        {city.type}
                                    </div>
                                </div>
                           	</div>
                            <div class="col-6 col-xl-2">
       	                        <div class="row">
                                   	<div class="col-auto">
                                        Resources
                                   	</div>
                                    <div class="col text-end">
                                        {city.city.resources.reduce((p, c) => c.amount + p, 0 )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <p>No cities found</p>
                {/each}
			{/if}
		</div>
	</div>
</div>
