<script lang="ts">
	import type { Message, CharSprite } from "$lib/types/message";
	import DialogueButtons from "$lib/features/dialogue/dialogueButtons.svelte";
	import DialogueBody from "$lib/features/dialogue/dialogueBody.svelte";
	import DialogueStore from "$lib/stores/dialogue.svelte";
	import { dev } from "$app/environment";
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";

	let {
		msgs = $bindable(),
		player,
		onEnd,
		leftCol,
		current = $bindable()
	}: { msgs: Message[]; player: CharSprite; onEnd?: () => void; leftCol?: Snippet, current: number } = $props();

	let done: boolean = $state(false);

	export function reset() {
		console.log("Trying to reset");
		current = 0;
		done = false;
	}

	function endDialogue() {
		if (onEnd) {
			onEnd();
		}
		DialogueStore.inDialogue = false;
		done = true;
	}

	function checkEnd() {
		const currentMsg = msgs[current];
		/*console.log("---");
		console.log(msgs, current);
		console.log(currentMsg);
		console.log("---");*/

		if ("choices" in currentMsg) {
			console.warn("Choice should not end a dialogue (probably)");
		} else if ("next" in currentMsg) {
			//current = currentMsg.next as number;
			const nextMsg = msgs[currentMsg.next as number];

			console.log(nextMsg);
			if (nextMsg === undefined) {
				console.log("pass");
				endDialogue();
			}
		} else {
			console.error("Invalid message type");
			return;
		}
	}

	onMount(() => {
		DialogueStore.inDialogue = true;
	});
</script>

{#if !done}
	<div
		class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
		style="z-index: 1050; background-color: rgba(0, 0, 0, 0.5);"
	>
		<div style="width: 100%; max-width: 1300px;">
			<div class="row justify-content-center">
				{@render leftCol?.()}
				<!-- defines its own width -->
				<div class="col-auto" style="max-width: 500px;">
					<div class="row justify-content-center">
						<div class="col">
							<img
								src={msgs[current].from.image}
								alt={msgs[current].from.name}
								class="img-fluid"
								style="max-width: 200px; max-height: 200px;"
							/>
						</div>
					</div>
					<div class="row justify-content-center">
						<div class="col wrapper position-relative">
							<h5>
								{msgs[current].from.name}
								{#if dev}({current}){/if}
							</h5>
							<DialogueBody {player} bind:current bind:msgs onEnd={checkEnd} />
							<DialogueButtons {msgs} bind:current onEnd={checkEnd} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

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
