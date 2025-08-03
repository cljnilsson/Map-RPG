<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import CityStore from "$lib/stores/city.svelte";

</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	uniqueKey="Resources"
	height={310}
	width={280}
	x={WindowStore.resources.x}
	y={WindowStore.resources.y}
	toggleKey="r"
	bind:visibility={WindowStore.resources.visible}
>
	{#snippet title()}
		<h4 class="my-2">Resources</h4>
	{/snippet}
	{#snippet body()}
		{#each CityStore.resources as resource}
		<div class="row align-items-center my-2">
			<div class="col-auto">
				<img src={resource.iconPath} alt={resource.name} style="max-width: 40px; max-height: 40px;">
			</div>
			<div class="col-6">
				{resource.name}
			</div>
			<div class="col-auto">
				{resource.amount}
			</div>
		</div>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
