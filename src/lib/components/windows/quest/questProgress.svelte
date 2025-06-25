<script lang="ts">
    import type { Quest } from "$lib/types/quest";

    let { active }: { active: Quest } = $props();
</script>

<div class="py-3">
    <ul>
        {#each active.progressGoals as goal, index}
            <li class:muted={index < active.progress}>{goal}</li>
        {/each}
    </ul>
</div>

<style>
    .muted {
       color: rgba(150, 150, 150) !important;
	}
</style>