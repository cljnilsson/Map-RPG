<script lang="ts">
	import { getAllBuildings } from "$lib/data/buildings";
	import { getAllQuests } from "$lib/data/quests";
	import { getAllItems } from "$lib/data/items";
	import { getAllResources } from "$lib/data/resources";
	import { getAllUnits } from "$lib/data/units";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let mode: "none" | "buildings" | "quests" | "units" | "items" | "resources" = $state("none");
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
			</div>
		</div>
		<div class="col">
			{#if mode === "buildings"}
				{#each getAllBuildings() as building (building.id)}
					<div>{building.name}</div>
				{/each}
			{:else if mode === "quests"}
				{#each getAllQuests() as quest (quest.id)}
                    <div class="row">
                        <div class="col">
                            <h3>{quest.title}</h3>
                            <p>{quest.description}</p>
                        </div>
                    </div>
				{/each}
			{:else if mode === "units"}
				{#each getAllUnits() as unit (unit.id)}
					<div>{unit.name}</div>
				{/each}
			{:else if mode === "items"}
				{#each getAllItems() as item (item.id)}
					<div>{item.name}</div>
				{/each}
			{:else if mode === "resources"}
				{#each getAllResources() as resource (resource.name)}
                <div class="row">
                    <div class="col-auto">
                        <img src={resource.iconPath} alt={resource.name} width="32" height="32" />
                    </div>
                    <div class="col">
                        {resource.name}
                    </div>
                </div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
