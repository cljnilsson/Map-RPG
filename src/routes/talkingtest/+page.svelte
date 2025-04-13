<script lang="ts">
	import type {Message, TextMessage, ChoiceMessage, CharSprite} from '$lib/types/message';

	let alice: CharSprite = { name: "Alice", image: "alice.png" };
	let bob: CharSprite = { name: "Bob", image: "bob.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };

	let msgs: Message[] = [
		{ type: 'text', text: 'Hello, how are you?', from: alice },
		{ type: 'text', text: "I'm good, thanks! How about you?", from: bob },
		{
			type: 'choice',
			choices: [
				"I'm doing well!",
				"Pretty busy lately.",
				"Could be better.",
				"All good here."
			],
			from: you
		},
		{ type: 'text', text: 'That sounds interesting! What kind of projects?', from: bob },
		{ type: 'text', text: 'Just some web development stuff. You know how it is.', from: alice }
	];

	let current = 0;

	function prev() {
		if (current > 0) current--;
	}

	function next() {
		if (current < msgs.length - 1) current++;
	}

	function selectChoice(choice: string) {
		msgs[current] = { type: 'text', text: choice, from: you };
		next();
	}
</script>


<div class="mt-5 mx-5 px-3">
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
							class="choice-btn btn btn-outline-primary"
							on:click={() => selectChoice(choice)}
						>
							{choice}
						</button>
					{/each}
				</div>
			{/if}

			<div class="button-container">
				<button class="btn btn-dark" on:click={prev} disabled={current === 0}>Previous</button>
				<button class="btn btn-dark" on:click={next} disabled={current === msgs.length - 1}
					>Next</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 2.5rem; /* Extra space for button overlap */
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
