<script lang="ts">
	import type {
		Message,
		TextMessage,
		CharSprite,
		ChoiceMessage,
		ChoiceOption
	} from '$lib/types/message';

	let {
		msgs = $bindable(),
		player,
		current = $bindable()
	}: { msgs: Message[]; player: CharSprite; current: number } = $props();

	function selectChoice(choice: ChoiceOption) {
		const nextIndex = choice.next;
		msgs[current] = { type: 'text', text: choice.text, from: player, next: nextIndex };
		current = nextIndex;
	}
</script>

{#if msgs[current].type === 'text'}
	<p>{(msgs[current] as TextMessage).text}</p>
{:else if msgs[current].type === 'choice'}
	<div class="choices-grid">
		{#each (msgs[current] as ChoiceMessage).choices as choice}
			<button
				class="choice-btn btn btn-sm btn-outline-primary"
				onclick={() => selectChoice(choice)}
			>
				{choice.text}
			</button>
		{/each}
	</div>
{/if}

<style>
	.choices-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.choice-btn {
		width: 100%;
		white-space: normal;
	}
</style>