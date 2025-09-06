<script lang="ts">
	import QuestItem from "$lib/features/window/windows/quest/questItem.svelte";
	import type { Quest } from "$lib/types/quest";

	let { quests, title, active = $bindable() }: { quests: Quest[]; title: string, active: Quest | undefined } = $props();

	let hideSection: boolean = $state(false);

	function toggleSection() {
		hideSection = !hideSection;
	}
</script>

<div class="row">
	<div class="col">
		<button onclick={toggleSection} class:muted={quests.length === 0}>{title} {#if quests.length > 0}<i class="bi {!hideSection ? "bi-dash" : "bi-plus"}"></i>{/if}</button>
		{#if !hideSection}
			{#each quests as q}
				<QuestItem {q} bind:active />
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	i {
		color: rgb(255, 167, 43);
	}
	
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: white;
		font-size: 1.25rem; // h5 size
		display: block;

		&:hover {
			font-weight: bold;
		}
	}
	
	.muted {
		color: rgba(150, 150, 150) !important;
	}
</style>