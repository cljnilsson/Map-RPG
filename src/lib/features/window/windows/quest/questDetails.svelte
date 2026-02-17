<script lang="ts">
	import type { Quest } from "$lib/types/quest";
	import QuestDialogue from "$lib/features/window/windows/quest/questDialogue.svelte";
	import QuestRewards from "$lib/features/window/windows/quest/questRewards.svelte";
	import QuestProgress from "$lib/features/window/windows/quest/questProgress.svelte";

	let { active = $bindable() }: { active: Quest } = $props();

	let showDialogue = $state(false);

	function toggleDialogue() {
		showDialogue = !showDialogue;
	}
</script>

<div class="quest-panel d-flex flex-column h-100">

  <!-- GROWING CONTENT -->
  <div class="flex-grow-1 overflow-auto">

    <h5>{active.title}</h5>

    {#if !showDialogue}
      <div class="questBody">
        <p>{active.description}</p>
        <QuestProgress {active} />
      </div>
    {:else}
      <QuestDialogue {active} />
    {/if}

  </div>

  <!-- CLAMPED BOTTOM -->
  <div>

    {#if !showDialogue}
      <QuestRewards {active} />
    {/if}

    <div class="text-center pt-3">
      {#if active.dialogue}
        <button
          type="button"
          class="btn btn-primary"
          onclick={toggleDialogue}>
          {showDialogue ? "View Quest" : "View Dialogue"}
        </button>
      {/if}

      <button type="button" class="btn btn-primary">
        Forfeit
      </button>
    </div>

  </div>

</div>

<style>
	h5 {
		color: rgb(255, 167, 43);
	}
</style>
