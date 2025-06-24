<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";

	type Resource = {
		name: string;
		amount: number;
		icon: string;
	};

	let resources: Resource[] = [
		{ name: "Gold", amount: 100, icon: "gold-icon.png" },
		{ name: "Wood", amount: 50, icon: "wood-icon.png" },
		{ name: "Stone", amount: 30, icon: "stone-icon.png" }
	];

</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	height={200}
	width={300}
	x={1300}
	y={1250}
	toggleKey="r"
	bind:visibility={WindowStore.resourcesVisibility}
>
	{#snippet title()}
		<h4 class="my-2">City Resources</h4>
	{/snippet}
	{#snippet body()}
		{#each resources as resource}
			<p>{resource.name} {resource.amount}</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
