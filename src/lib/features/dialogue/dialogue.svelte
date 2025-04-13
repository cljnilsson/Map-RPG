<script lang="ts">
	import type { Message, CharSprite } from '$lib/types/message';
	import DialogueButtons from '$lib/features/dialogue/dialogueButtons.svelte';
	import DialogueBody from '$lib/features/dialogue/dialogueBody.svelte';

	let { msgs, player, onEnd }: { msgs: Message[]; player: CharSprite; onEnd?: () => void } =
		$props();
	let current: number = $state(0);

	function checkEnd() {
		const nextMsg = msgs[current];
		if (!nextMsg || (nextMsg.type === 'text' && nextMsg.next === undefined)) {
			if (onEnd) {
				onEnd();
			}
		} else {
			console.warn('Premature end?');
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
		<DialogueBody {player} bind:current bind:msgs onEnd={checkEnd}></DialogueBody>
		<DialogueButtons {msgs} bind:current onEnd={checkEnd}></DialogueButtons>
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
</style>
