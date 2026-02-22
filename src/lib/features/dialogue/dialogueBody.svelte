<script lang="ts">
	import type { Message, TextMessage, CharSprite, ChoiceMessage, ChoiceOption } from "$lib/types/message";

	let {
		msgs = $bindable(),
		player,
		current = $bindable(),
		onEnd
	}: { msgs: Message[]; player: CharSprite; current: number; onEnd?: (by: "Next" | "Close" | "Choice") => void } = $props();

	async function selectChoice(choice: ChoiceOption) {
		if (choice.onChoice) {
			choice.onChoice();
		}

		msgs[current] = { type: "text", text: choice.text, from: player, next: choice.next };

		if (choice.next) {
			current = choice.next;
		} else {
			console.warn("Is undefined, might be unwaranted, ending with choice node?");
			if (onEnd) {
				onEnd("Choice");
			}
		}
	}
</script>

{#if msgs[current]?.type === "text"}
	<p>{(msgs[current] as TextMessage).text}</p>
{:else if msgs[current]?.type === "choice"}
	<div
		class="choices-grid"
		class:choice-grid-sm={(msgs[current] as ChoiceMessage).choices.length <= 4}
		class:choice-grid-md={(msgs[current] as ChoiceMessage).choices.length > 4 && (msgs[current] as ChoiceMessage).choices.length < 8}
		class:choice-grid-lg={(msgs[current] as ChoiceMessage).choices.length >= 8}
	>
		{#each (msgs[current] as ChoiceMessage).choices as choice (choice.text)}
			<button type="button" class="choice-btn btn btn-sm btn-outline-primary" onclick={() => selectChoice(choice)}>
				{choice.text}
			</button>
		{/each}
	</div>
{:else}
	<p>Something went wrong trying to load dialogue with id {current}, the loaded messages have size {msgs.length}</p>
{/if}

<style>
	.choices-grid {
		display: grid;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.choice-grid-sm {
		grid-template-columns: repeat(2, 1fr);
	}

	.choice-grid-md {
		grid-template-columns: repeat(3, 1fr);
	}

	.choice-grid-lg {
		grid-template-columns: repeat(4, 1fr);
	}

	.choice-btn {
		width: 100%;
		white-space: normal;
	}
</style>
