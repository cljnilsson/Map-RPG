<script lang="ts">
	import type { VendorItem } from "$lib/types/item";
	import { getItem } from "$lib/data/items";
    import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import {q2c} from "$lib/utils/itemQuality";
	import type { Building } from "$lib/types/building";
	import Tabs from "$lib/components/utils/tabs.svelte";
	import Tab from "$lib/components/utils/tab.svelte";
	import Inventory from "$lib/features/inventory/inventory.svelte";

	const { level, building }: {level: number, building: Omit<Building, "componentOnClick">} = $props();

    let maxLoan = $state(5000);
	let currentLoans: {
		full: number;
		paid: number;
		interestRate: number;
	}[] = $state([]);
	const tabs = [
		{ title: "Loans", target: "loans" },
		{ title: "Storage", target: "storage" },
	];
</script>

<div class="py-5">
	<Tabs {tabs}>
		<Tab id={tabs[0].target} first={true}>
			<h4>Loans</h4>
			<div class="row border justify-content-center">
				{#each currentLoans as loan}
					<div class="col">
						wow!
					</div>
				{:else}
					<div class="col">
						No loans yet!
					</div>
				{/each}
			</div>
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Storage</h4>
			<Inventory title="Inventory" />
		</Tab>
	</Tabs>
</div>