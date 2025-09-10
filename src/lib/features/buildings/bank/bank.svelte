<script lang="ts">
	import type { Building } from "$lib/types/building";
	import Tabs from "$lib/components/utils/tabs.svelte";
	import Tab from "$lib/components/utils/tab.svelte";
	import Inventory from "$lib/features/inventory/inventory.svelte";
	import type { Resource } from "$lib/types/resource";
	import Storage from "$lib/features/buildings/bank/storage.svelte";
	import ResourceSelection from "$lib/features/buildings/market/resourceSelection.svelte";

	/*
	TODO
	allow multiple resources in one loan
	allow toggle
	set inventorty mode to storage to modify click behavior
	storage controller?
	storage db schema
*/

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();
	let maxLoan = $state(5000);
	let currentLoans: {
		full: number;
		paid: number;
		interestRate: number;
	}[] = $state([]);
	let tradeFor = $state<Resource | undefined>(undefined);
	let toLoan: number | undefined = $state(undefined);

	const tabs = [
		{ title: "Loans", target: "loans" },
		{ title: "Storage", target: "storage" }
	];
</script>

<div class="py-5">
	<Tabs {tabs}>
		<Tab id={tabs[0].target} first={true}>
			<h4>Loans</h4>
			<div class="row justify-content-center">
				<div class="col-auto">
					<ResourceSelection bind:selectedResource={tradeFor} />
				</div>
			</div>
			<div class="input-group mb-3">
				<input
					type="number"
					class="form-control"
					bind:value={toLoan}
					placeholder={!tradeFor ? "Amount to loan" : "Amount " + tradeFor.name + " to loan"}
					aria-label="Amount of resource(s) to loan"
					aria-describedby="button-new-loan"
				/>
				<button class="btn btn-outline-secondary" type="button" id="button-new-loan">Loan!</button>
			</div>
			<div class="row justify-content-center">
				<div class="col">
					<table class="table">
						<thead>
							<tr>
								<th scope="col">Resource(s)</th>
								<th scope="col">Amount</th>
								<th scope="col">Date</th>
								<th scope="col">Paid</th>
							</tr>
						</thead>
						<tbody>
							{#each currentLoans as loan, index (index)}
								<tr>
									<td> </td>
								</tr>
							{:else}
								<tr>
									<td>No loans yet!</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Storage</h4>
			<Storage />
			<Inventory title="Inventory" showEmptySlots={false} showMoney={false} />
		</Tab>
	</Tabs>
</div>
