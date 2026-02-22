<script lang="ts">
	import type { Quest } from "$lib/types/quest";

	let { q, active = $bindable() }: { q: Quest; active: Quest | undefined } = $props();

	function selectQuest(quest: Quest) {
		active = quest;
	}
</script>

<button
    type="button"
	class="ms-3 text-button"
	class:selected={active?.id === q.id}
	aria-pressed={active?.id === q.id}
	onclick={() => selectQuest(q)}
	onkeydown={(e) => e.key === "Enter" && selectQuest(q)}
>
	{q.title}
</button>

<style lang="scss">
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		color: white;

		&:hover {
			font-weight: bold;
		}
		&.selected {
			color: rgb(88, 167, 250);
		}
	}
</style>
