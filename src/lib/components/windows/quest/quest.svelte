<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import type { Message } from "$lib/types/message";

	type Quest = {
		id: string;
		title: string;
		description: string;
		reward: string;
		Dialogue: Message[];
		mainQuest: boolean;
		status: "active" | "completed" | "failed";
	};

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

	function selectQuest(quest: Quest) {
		active = quest;
	}
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
					<p class="ms-3" class:selected={active?.id === q.id} onclick={() => selectQuest(q)}>{q.title}</p>
				{/each}
				<h5>Side</h5>
				{#each sideQuests as q}
					<p>{q.title}</p>
				{/each}
			</div>
			<div class="col">
				{#if active}
					<h5>{active.title}</h5>
					<p>{active?.description ?? ""}</p>
					<h5>Rewards:</h5>
					<p>{active.reward}</p>
					<button>View Dialogue</button>
				{/if}
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style lang="scss">
	p {
		&:hover {
			font-weight: bold;
		}
		&.selected {
			color: rgb(88, 167, 250);
		}
	}
</style>
