<script lang="ts">
	import Dialogue from "$lib/features/dialogue/dialogue.svelte";
	import type { Message, CharSprite } from "$lib/types/message";
	import DialogueController from "$lib/controller/dialogue.svelte";

	const alice: CharSprite = { name: "Alice", image: "alice.png" } as const;
	const bob: CharSprite = { name: "Bob", image: "bob.png" } as const;
	const you: CharSprite = { name: "You", image: "char.jpg" } as const;

	let msgs: Message[] = [
		{ type: "text", text: "Hello, how are you?", from: alice, next: 1 },
		{ type: "text", text: "I'm good, thanks! How about you?", from: bob, next: 2 },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I'm doing well!", next: 3, saveResponse: true },
				{ text: "Pretty busy lately.", next: 4, saveResponse: true },
				{ text: "Could be better.", next: 4, saveResponse: true },
				{ text: "All good here.", next: 4, saveResponse: true }
			]
		},
		{
			type: "text",
			text: "Good to hear",
			from: bob,
			next: -1
		},
		{ type: "text", text: "I hope things ease up for you soon.", from: bob, next: -1 }
	];

	let msgs2: Message[] = [
		{ type: "text", text: "Bob just got here.", from: alice, next: 1 },
		{ type: "text", text: "Looks like he is coming over.", from: alice, next: -1 }
	];

	function makeDialogue(msgs: Message[]) {
		new DialogueController({
			msgs: msgs,
			player: you,
			canClose: true
		});
	}
</script>

<div class="mt-5 mx-5 px-3 wrapper">
	<button onclick={() => makeDialogue(msgs2)}>Talk to Alice</button>
	<button onclick={() => makeDialogue(msgs)}>Talk to ALice and Bob</button>
	{DialogueController.all.length}
	<Dialogue />
</div>


<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		max-width: 1000px;
	}
</style>