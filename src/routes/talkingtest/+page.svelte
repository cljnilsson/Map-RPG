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

	let choice1 = new DialogueController({
		msgs: msgs,
		player: you,
	});

	let choice2 = new DialogueController({
		msgs: msgs2,
		player: you
	});

	let active: DialogueController | undefined = $state(undefined);
</script>

<div class="mt-5 mx-5 px-3">
	<button onclick={() => active = choice2}>Talk to Alice</button>
	<button onclick={() => active = choice1}>Talk to ALice and Bob</button>
	{#if active}
		<Dialogue bind:current={active.current} msgs={active.msgs} player={active.player} onEnd={active.onEnd}></Dialogue>
	{/if}
</div>
