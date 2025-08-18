<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import type { Building } from "$lib/types/building";
	import Tabs from "$lib/components/utils/tabs.svelte";
	import Tab from "$lib/components/utils/tab.svelte";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();
	const tabs = [
		{ title: "Pen", target: "pen" },
		{ title: "Eggs", target: "eggs" },
		{ title: "Beastiary", target: "beastiary" }
	];
	let beasts = [
		{ name: "Beast 1", type: "Type A", level: 1, food: "Grass" },
		{ name: "Beast 2", type: "Type B", level: 2, food: "Meat" }
	];
</script>

<div class="py-5">
	<Tabs {tabs}>
		<Tab id={tabs[0].target}>
			<h4>Pen</h4>
			{#each beasts as beast}
				<div class="beast-item">
					<h5>{beast.name}</h5>
					<p>Type: {beast.type}</p>
					<p>Level: {beast.level}</p>
					<p>Food: {beast.food}</p>
				</div>
			{/each}
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Eggs</h4>
			<p>Attributes content here...</p>
		</Tab>
		<Tab id={tabs[2].target}>
			<h4>Inventory</h4>
			<p>Inventory content here...</p>
		</Tab>
	</Tabs>
</div>
