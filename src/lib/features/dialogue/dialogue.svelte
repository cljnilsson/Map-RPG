<script lang="ts">
	import type {
		Message,
		TextMessage,
		CharSprite,
		ChoiceMessage,
		ChoiceOption
	} from '$lib/types/message';

	let { msgs, player }: { msgs: Message[]; player: CharSprite } = $props();
	let current: number = $state(0);

	function prev() {
		if (current > 0) current--;
	}

	function selectChoice(choice: ChoiceOption) {
		const nextIndex = choice.next;
		msgs[current] = { type: 'text', text: choice.text, from: player, next: nextIndex };
		current = nextIndex;
	}

	function next() {
		const msg = msgs[current];
		if (msg.type === 'text' && msg.next !== undefined) {
			current = msg.next;
		}
	}
</script>

<div class="row justify-content-center">
	<div class="col-6">
		<img
			src={msgs[current].from.image}
			alt={msgs[current].from.name}
			class="img-fluid"
			style="max-width: 200px; max-height: 200px;"
		/>
	</div>
</div>
<div class="row justify-content-center">
	<div class="col-6 wrapper position-relative">
		<h5>{msgs[current].from.name} ({current})</h5>
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

		<div class="button-container">
			<button class="btn btn-dark" onclick={prev} disabled={current === 0}>Previous</button>
			<button class="btn btn-dark" onclick={next} disabled={current === msgs.length - 1}
				>Next</button
			>
		</div>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.5rem; /* Extra space for button overlap */
		min-height: 10rem; /* attempt to have the box same size always */
		position: relative;
		overflow: visible;
	}

	.button-container {
		position: absolute;
		bottom: 0.25rem;
		right: 0.25rem;
		transform: translateY(50%);
		display: flex;
		gap: 0.5rem;
	}

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
