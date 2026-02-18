<script lang="ts">
	import QuestDetails from "$lib/features/window/windows/quest//questDetails.svelte";
	import QuestSection from "$lib/features/window/windows/quest/questSection.svelte";
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import QuestController from "$lib/controller/quest.svelte";
	import type { Quest } from "$lib/types/quest";
    import { onMount } from "svelte";

	let mainQuests: Quest[] = $derived(QuestController.quests.filter((q) => q.mainQuest && q.status === "active"));
	let sideQuests: Quest[] = $derived(QuestController.quests.filter((q) => !q.mainQuest && q.status === "active"));
	let completedQuests: Quest[] = $derived(QuestController.quests.filter((q) => q.status === "completed"));

	let active: Quest | undefined = $state(undefined);

	let questWindow = WindowController.getByName("Quests");

	onMount(() => {
     	if([...mainQuests, ...sideQuests].length > 0) {
     	  active = [...mainQuests, ...sideQuests][0];
     	}
	});
</script>

<Window uniqueKey="Quests" height={700} width={600} x={questWindow.x} y={questWindow.y} toggleKey="q" bind:visibility={questWindow.visible}>
	{#snippet title()}
		<h4 class="my-2">Quests</h4>
	{/snippet}
	{#snippet body()}
		<div class="row flex-grow-1 h-100">
			<div class="col-4 border-end">
				<QuestSection quests={mainQuests} bind:active title="Main" />
				<QuestSection quests={sideQuests} bind:active title="Side" />
				<QuestSection quests={completedQuests} bind:active title="Completed" />
			</div>
			<div class="col h-100">
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
