<script lang="ts">
	import Dialogue from '$lib/features/dialogue/dialogue.svelte';
	import type { Message, CharSprite } from '$lib/types/message';

	let alice: CharSprite = { name: 'Alice', image: 'alice.png' };
	let bob: CharSprite = { name: 'Bob', image: 'bob.png' };
	let you: CharSprite = { name: 'You', image: 'char.jpg' };

	let msgs: Message[] = [
		{ type: 'text', text: 'Hello, how are you?', from: alice, next: 1 },
		{ type: 'text', text: "I'm good, thanks! How about you?", from: bob, next: 2 },
		{
			type: 'choice',
			from: you,
			choices: [
				{ text: "I'm doing well!", next: 3 },
				{ text: 'Pretty busy lately.', next: 4 },
				{ text: 'Could be better.', next: 4 },
				{ text: 'All good here.', next: 3 }
			]
		},
		{ type: 'text', text: 'That sounds interesting! What kind of projects?', from: bob, next: 5 },
		{ type: 'text', text: 'I hope things ease up for you soon.', from: bob, next: 5 },
		{ type: 'text', text: 'Just some web development stuff. You know how it is.', from: alice }
	];
</script>

<div class="mt-5 mx-5 px-3">
	<Dialogue {msgs} player={you}></Dialogue>
</div>
