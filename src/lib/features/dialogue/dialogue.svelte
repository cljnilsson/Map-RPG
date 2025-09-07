<script lang="ts">
	import DialogueButtons from "$lib/features/dialogue/dialogueButtons.svelte";
	import DialogueBody from "$lib/features/dialogue/dialogueBody.svelte";
	import DialogueController from "$lib/controller/dialogue.svelte";
	import { dev } from "$app/environment";
	import type { Snippet } from "svelte";

	let { leftCol, maxWidth = 1300 }: { leftCol?: Snippet; maxWidth?: number } = $props();
	let active: DialogueController | undefined = $derived(DialogueController.all[0] ? DialogueController.all[0] : undefined);

	$effect(() => {
		DialogueController.inDialogue = active !== undefined; // don't like using $effect for this, will reconsider later
	});

	function endDialogue() {
		if (!active) {
			console.error("No active dialogue to end");
			return;
		}

		if (active.onEnd) {
			active.onEnd();
		}

		//DialogueController.inDialogue = false;
	}

	function checkEnd(by: "Next" | "Close" | "Choice") {
		if (!active) {
			console.error("No active dialogue to end");
			return;
		}

		if (by === "Next" || by === "Choice") {
			const currentMsg = active.msgs[active.current];

			if ("choices" in currentMsg) {
				console.warn("Choice should not end a dialogue (probably)");
			} else if ("next" in currentMsg) {
				//current = currentMsg.next as number;
				const nextMsg = active.msgs[currentMsg.next as number];

				console.log(nextMsg);
				if (nextMsg === undefined) {
					console.log("pass");
					endDialogue();
				}
			} else {
				console.error("Invalid message type");
				return;
			}
		} else {
			// Ended by close button
			console.log("Closed dialogue");
			endDialogue();
		}
	}
</script>

{#if active}
	<div
		class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
		style="z-index: 1050; background-color: rgba(0, 0, 0, 0.5);"
	>
		<div style="width: 100%; max-width: {maxWidth}px;">
			<div class="row justify-content-center">
				{@render leftCol?.()}
				<!-- defines its own width -->
				<div class="col-auto" style="max-width: 500px;">
					<div class="row justify-content-center">
						<div class="col">
							<img
								src={active.msgs[active.current].from.image}
								alt={active.msgs[active.current].from.name}
								class="img-fluid"
								style="max-width: 200px; max-height: 200px;"
							/>
						</div>
					</div>
					<div class="row justify-content-center">
						<div class="col wrapper position-relative">
							<h5>
								{active.msgs[active.current].from.name}
								{#if dev}({active.current}){/if}
							</h5>
							<DialogueBody player={active.player} bind:current={active.current} bind:msgs={active.msgs} onEnd={checkEnd} />
							<DialogueButtons msgs={active.msgs} bind:current={active.current} onEnd={checkEnd} canClose={active.canClose} />
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
		min-width: 300px;
	}
</style>
