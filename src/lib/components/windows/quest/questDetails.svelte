<script lang="ts">
	import type { Quest } from "$lib/types/quest";
	import QuestDialogue from "$lib/components/windows/quest/questDialogue.svelte";
	import QuestRewards from "$lib/components/windows/quest/questRewards.svelte";
	import QuestProgress from "$lib/components/windows/quest/questProgress.svelte";

	let { active = $bindable() }: { active: Quest } = $props();

	let showDialogue = $state(false);

	function toggleDialogue() {
		showDialogue = !showDialogue;
	}
</script>

<h5>{active.title}</h5>
{#if !showDialogue}
	<div class="questBody">
		<p>{active.description}</p>
		<QuestProgress {active} />
	</div>
	<QuestRewards {active} />
{:else}
	<QuestDialogue {active} />
{/if}
<div class="text-center pt-3">
	{#if active.dialogue}
		<button class="btn btn-primary" onclick={toggleDialogue}>{showDialogue ? "View Quest" : "View Dialogue"}</button>
	{/if}
	<button class="btn btn-primary">Forfeit</button>
</div>

<style>
	h5 {
		color: rgb(255, 167, 43);
	}
</style>
