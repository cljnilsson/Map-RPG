<script lang="ts">
	import Dialogue from "$lib/features/dialogue/dialogue.svelte";
	import type { Message, CharSprite } from "$lib/types/message";

	let alice: CharSprite = { name: "Alice", image: "alice.png" };
	let bob: CharSprite = { name: "Bob", image: "bob.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };

	let current: number = $state(0);

	let msgs: Message[] = [
		{ type: "text", text: "Hello, how are you?", from: alice, next: 1 },
		{ type: "text", text: "I'm good, thanks! How about you?", from: bob, next: 2 },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I'm doing well!", next: 3, saveResponse: true},
				{ text: "Pretty busy lately.", next: 4, saveResponse: true },
				{ text: "Could be better.", next: 4, saveResponse: true },
				{ text: "All good here.", next: 4, saveResponse: true}
			]
		},
		{
			type: "text",
			text: "Good to hear",
			from: bob,
			next: -1
		},
		{ type: "text", text: "I hope things ease up for you soon.", from: bob, next: -1 },
	];

	let msgs2: Message[] = [
		{ type: "text", text: "Bob just got here.", from: alice, next: 1 },
		{ type: "text", text: "Looks like he is coming over.", from: alice, next: -1 }
	];

	function onEnd() {
		console.log("Dialogue ended");
	}
</script>

<div class="mt-5 mx-5 px-3">
	<button>Talk to Alice</button><button>Talk to ALice and Bob</button>
	<Dialogue bind:current={current} {msgs} player={you} {onEnd}></Dialogue>
</div>
