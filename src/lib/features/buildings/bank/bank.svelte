<script lang="ts">
	import type { Building } from "$lib/types/building";
	import Tabs from "$lib/components/utils/tabs.svelte";
	import Tab from "$lib/components/utils/tab.svelte";
	import Inventory from "$lib/features/inventory/inventory.svelte";
	import type { BaseResource } from "$lib/types/resource";
	import Storage from "$lib/features/buildings/bank/storage.svelte";
	import ResourceSelection from "$lib/features/buildings/market/resourceSelection.svelte";
	import dayjs from "dayjs";
	import { onMount } from "svelte";
	import { getLoans, postLoan } from "$lib/api/loans.remote";
	import { PlayerController } from "$lib/controller/character.svelte";
	import { SvelteDate } from "svelte/reactivity";
	import { getResource, safeGetResource } from "$lib/data/resources";
	import MapController from "$lib/controller/map.svelte";

	/*
		TODO
		allow multiple resources in one loan
		allow toggle
		set inventorty mode to storage to modify click behavior
		storage controller?
		storage db schema
	*/

	const { level, building, cityName, cityDataId }: { level: number; building: Omit<Building, "componentOnClick">; cityName: string, cityDataId: number } = $props();
	let maxLoanAmount = $state(5000);
	let maxLoans = $state(5);
	let currentLoans: {
		full: number;
		paid: number;
		interestRate: number;
		resource: BaseResource;
		date: Date;
	}[] = $state([]);
	let tradeFor = $state<BaseResource | undefined>(undefined);
	let toLoan: number | undefined = $state(undefined);

	const tabs = [
		{ title: "Loans", target: "loans" },
		{ title: "Storage", target: "storage" }
	];

	function newLoan() {
		if (!toLoan || !tradeFor) {
			return;
		}

		if (currentLoans.length > maxLoans || toLoan >= maxLoanAmount) {
			console.warn("Too many existing loans or the amount is too large");
			return;
		}
		const newLoan = {
			full: toLoan,
			paid: 0,
			interestRate: 0,
			resource: tradeFor,
			date: new Date()
		};

		currentLoans = [...currentLoans, newLoan];

		toLoan = 0;
		tradeFor = undefined;

		// characterId is not implemented but easy to get in theory
		/*
			charaacterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
			cityName: v.string(),
			resourceName: v.string(),
			value: v.pipe(v.number(), v.integer(), v.toMinValue(0))
		*/
		postLoan({
			charaacterId: PlayerController.id,
			cityName: cityName,
			resourceName: newLoan.resource.name,
			value: newLoan.full
		});
	}

	onMount(async () => {
		const allLoans = await getLoans();
		console.log(allLoans);
		currentLoans = allLoans.map((v) => {
			const tResource = safeGetResource(v.resource);
			if (!tResource) {
				throw Error("Resource from database does not exist on client.");
			}

			return {
				full: v.full,
				paid: v.paid,
				interestRate: 0,
				resource: tResource,
				date: new SvelteDate(v.date)
			};
		});
	});
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
			<div class="row justify-content-center">
				<div class="col-7 px-0">
					<div class="input-group mb-3">
						<input
							type="number"
							class="form-control"
							bind:value={toLoan}
							placeholder={!tradeFor ? "Amount to loan" : "Amount " + tradeFor.name + " to loan"}
							aria-label="Amount of resource(s) to loan"
							aria-describedby="button-new-loan"
						/>
						<button
							class="btn btn-outline-dark"
							type="button"
							id="button-new-loan"
							onclick={newLoan}
							disabled={!tradeFor || !toLoan}>Loan!</button
						>
					</div>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col">
					<table class="table table-secondary">
						<thead>
							<tr>
								<th scope="col">Resource(s)</th>
								<th scope="col">Date</th>
								<th scope="col">Paid</th>
							</tr>
						</thead>
						<tbody>
							{#each currentLoans as loan, index (index)}
								<tr>
									<td>{loan.resource.name}</td>
									<td>{dayjs(loan.date).format("MM/DD hh:ss")}</td>
									<td>{loan.paid} / {loan.full}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Storage</h4>
			<Storage {cityDataId}/>
			<Inventory title="Inventory" showEmptySlots={false} showMoney={false} mode="Bank" {cityDataId} />
		</Tab>
	</Tabs>
</div>
