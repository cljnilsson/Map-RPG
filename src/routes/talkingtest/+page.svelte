<script lang="ts">
	import Dialogue from "$lib/features/dialogue/dialogue.svelte";
	import type { Message, CharSprite } from "$lib/types/message";

	let alice: CharSprite = { name: "Alice", image: "alice.png" };
	let bob: CharSprite = { name: "Bob", image: "bob.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };

	let msgs: Message[] = [
		{ type: "text", text: "Hello, how are you?", from: alice },
		{ type: "text", text: "I'm good, thanks! How about you?", from: bob },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I'm doing well!" },
				{ text: "Pretty busy lately.", next: 4 },
				{ text: "Could be better.", next: 4 },
				{ text: "All good here." }
			]
		},
		{
			type: "text",
			text: "That sounds interesting! What kind of projects?",
			from: bob,
			next: 5
		},
		{ type: "text", text: "I hope things ease up for you soon.", from: bob, next: 5 },
		{ type: "text", text: "Just some web development stuff. You know how it is.", from: alice }
	];

	let msgs2: Message[] = [
		{ type: "text", text: "Bob just got here.", from: alice },
		{ type: "text", text: "Looks like he is coming over.", from: alice }
	];

	function onEnd() {
		console.log("Dialogue ended");
	}
</script>

<div class="mt-5 mx-5 px-3">
	<button>Talk to Alice</button><button>Talk to ALice and Bob</button>
	<Dialogue {msgs} player={you} {onEnd}></Dialogue>
</div>
