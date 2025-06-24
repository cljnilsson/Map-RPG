<script lang="ts">
	import QuestItem from "$lib/components/windows/quest/questItem.svelte";
	import QuestDetails from "$lib/components/windows/quest//questDetails.svelte";
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import type { Quest } from "$lib/types/quest";

	let testQuest: Quest = {
		id: "test-quest",
		title: "Test Quest",
		description: "This is a test quest to demonstrate the quest window.",
		reward: "100 gold",
		Dialogue: [
			{
				from: {
					name: "NPC",
					image: ""
				},
				type: "text",
				text: "Welcome to the test quest!",
				next: 1
			},
			{
				from: {
					name: "NPC",
					image: ""
				},
				type: "text",
				text: "What do I need to do?",
				next: 2
			},
			{
				from: {
					name: "NPC",
					image: ""
				},
				type: "text",
				text: "Just complete the quest and you'll be rewarded!",
				next: -1
			}
		],
		mainQuest: true,
		status: "active"
	};

	let quests: Quest[] = $state([testQuest]);
	let mainQuests: Quest[] = $derived(quests.filter((q) => q.mainQuest));
	let sideQuests: Quest[] = $derived(quests.filter((q) => !q.mainQuest));
	
	let active: Quest | undefined = $state(undefined);
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={700} width={600} x={1300} y={450} toggleKey="q" bind:visibility={WindowStore.navigationVisibility}>
	{#snippet title()}
		<h4 class="my-2">Quests</h4>
	{/snippet}
	{#snippet body()}
		<div class="row">
			<div class="col-4 border-end">
				<h5>Main</h5>
				{#each mainQuests as q}
					<QuestItem {q} bind:active />
				{/each}
				<h5 class="mt-3" class:muted={sideQuests.length === 0}>Side</h5>
				{#each sideQuests as q}
					<QuestItem {q} bind:active />
				{/each}
			</div>
			<div class="col">
				{#if active}
					<QuestDetails {active} />
				{/if}
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style>
	.muted {
		color: rgba(150, 150, 150) !important;
	}
</style>