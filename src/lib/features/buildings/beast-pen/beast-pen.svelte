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
		{ icon: "/units/eagle.jpg", name: "Eagle", type: "Type A", level: 1, food: "Grass" },
		{ icon: "/units/panther.png", name: "Panther", type: "Type B", level: 2, food: "Meat" }
	];
	let beastKnowledge = [
		{ icon: "/units/eagle.jpg", name: "Eagle", description: ["The eagle hunts at night."] },
		{ icon: "/units/panther.png", name: "Panther", description: ["The panther is know to sneak up on any foe!"] }
	];
	let eggs: string[] = []; // TODO
	let selectedBeast: string | null = $state(null);
	let foundBeast = $derived(beastKnowledge.find((v) => v.name === selectedBeast));
</script>

<div class="py-5">
	<Tabs {tabs}>
		<Tab id={tabs[0].target} first={true}>
			<h4>Pen</h4>
			{#each beasts as beast}
				<div class="beast-item my-3">
					<div class="row">
						<div class="col-auto">
							<img src={beast.icon} alt={beast.name} />
						</div>
						<div class="col">
							<div class="row">
								<div class="col">
									<h5 class="mb-0">{beast.name} - level {beast.level}</h5>
								</div>
							</div>
							<div class="row">
								<div class="col">
									<small>{beast.type}</small>
									<small>Food: {beast.food}</small>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</Tab>
		<Tab id={tabs[1].target}>
			<h4>Eggs</h4>
			{#each eggs as egg}
				<span>TODO</span>
			{:else}
				<span>You have no eggs</span>
			{/each}
		</Tab>
		<Tab id={tabs[2].target}>
			<h4>Beastiary</h4>
			<div class="row">
				{#each beastKnowledge as beast}
					<div class="col-auto">
						<img src={beast.icon} alt={beast.name} onclick={() => (selectedBeast = beast.name)} />
					</div>
				{:else}
					<span>You have no knowledge about any beasts</span>
				{/each}
				{#if selectedBeast}
					<div class="row mt-3">
						<div class="col">
							<h5>{foundBeast?.name ?? ""}</h5>
							{#each foundBeast?.description ?? [] as line}
								<p>{line}</p>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</Tab>
	</Tabs>
</div>
