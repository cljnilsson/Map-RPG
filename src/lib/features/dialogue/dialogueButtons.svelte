<script lang="ts">
	import type { Message } from "$lib/types/message";

	let {
		current = $bindable(),
		msgs,
		onEnd,
		canClose = false
	}: { current: number; msgs: Message[]; onEnd: (by: "Next" | "Close") => void, canClose: boolean } = $props();

	function next() {
		const msg = msgs[current];
		if (msg.type === "text") {
			if (!msg.next || msg.next === -1) {
				if (onEnd) {
					onEnd("Next");
				}
			} else {
				current = msg.next;
			}
		} else {
			console.warn("This should only be called on text dialogues, check dialogue body")
		}
	}

	function close() {
		if (onEnd) {
			onEnd("Close");
		}
	}

	function prev() {
		if (current > 0) current--;
	}
</script>

<div class="button-container">
	{#if canClose}
		<button class="btn btn-dark" onclick={close}>Leave</button>
	{/if}
	<button class="btn btn-dark" onclick={prev} disabled={current === 0}>Previous</button>
	<button class="btn btn-dark" onclick={next} disabled={msgs[current].type === "choice"}>Next</button>
</div>

<style>
	.button-container {
		position: absolute;
		bottom: 0.25rem;
		right: 0.25rem;
		transform: translateY(50%);
		display: flex;
		gap: 0.5rem;
	}
</style>
