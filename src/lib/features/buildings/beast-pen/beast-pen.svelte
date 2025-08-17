<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import type { Building } from "$lib/types/building";
	import Tabs from "$lib/components/utils/tabs.svelte";
	import Tab from "$lib/components/utils/tab.svelte";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();
	const tabs = [
		{ title: "Eggs", target: "eggs" },
		{ title: "Beastiary", target: "beastiary" }
	];
</script>

<div class="py-5">
	<Tabs {tabs}>
		<Tab id={tabs[0].target}>
			<h4>Attributes</h4>
			<p>Attributes content here...</p>
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Inventory</h4>
			<p>Inventory content here...</p>
		</Tab>
	</Tabs>
</div>
