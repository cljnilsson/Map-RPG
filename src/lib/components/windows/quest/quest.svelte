<script lang="ts">
	import QuestDetails from "$lib/components/windows/quest//questDetails.svelte";
	import QuestSection from "$lib/components/windows/quest/questSection.svelte";
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import QuestStore from "$lib/stores/quest.svelte";
	import type { Quest } from "$lib/types/quest";

	let mainQuests: Quest[] = $derived(QuestStore.quests.filter((q) => q.mainQuest && q.status === "active"));
	let sideQuests: Quest[] = $derived(QuestStore.quests.filter((q) => !q.mainQuest && q.status === "active"));
	let completedQuests: Quest[] = $derived(QuestStore.quests.filter((q) => q.status === "completed"));

	let active: Quest | undefined = $state(undefined);
</script>

<Window uniqueKey="Quests" height={700} width={600} x={1300} y={450} toggleKey="q" bind:visibility={WindowStore.questVisibility}>
	{#snippet title()}
		<h4 class="my-2">Quests</h4>
	{/snippet}
	{#snippet body()}
		<div class="row">
			<div class="col-4 border-end">
				<QuestSection quests={mainQuests} bind:active title="Main" />
				<QuestSection quests={sideQuests} bind:active title="Side" />
				<QuestSection quests={completedQuests} bind:active title="Completed" />
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
