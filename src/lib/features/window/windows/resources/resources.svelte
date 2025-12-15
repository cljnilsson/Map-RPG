<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import CityStore from "$lib/stores/city.svelte";

	let resourceWindow = WindowController.getByName("Resources");
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	uniqueKey="Resources"
	height={310}
	width={350}
	x={resourceWindow.x}
	y={resourceWindow.y}
	toggleKey="r"
	bind:visibility={resourceWindow.visible}
>
	{#snippet title()}
		<h4 class="my-2">Resources</h4>
	{/snippet}
	{#snippet body()}
		{#each CityStore.resources as resource (resource.name)}
			<div class="row align-items-center my-2">
				<div class="col-auto">
					<img src={resource.iconPath} alt={resource.name} style="max-width: 40px; max-height: 40px;">
				</div>
				<div class="col-3">
					{resource.name}
				</div>
				<div class="col-4">
					{resource.amount} / {resource.baseLimit}
				</div>
				<div class="col-2 text-end">
					{resource.production}/m
				</div>
			</div>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
