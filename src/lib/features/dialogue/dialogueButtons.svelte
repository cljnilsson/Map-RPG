<script lang="ts">
	import type { Message } from "$lib/types/message";

	let {
		current = $bindable(),
		msgs,
		onEnd
	}: { current: number; msgs: Message[]; onEnd: () => void } = $props();

	function next() {
		const msg = msgs[current];
		if (msg.type === "text") {
			if (!msg.next || msg.next === -1) {
				if (onEnd) {
					onEnd();
				}
			} else {
				current = msg.next;
			}
		} else {
			console.warn("This should only be called on text dialogues, check dialogue body")
		}
	}

	function prev() {
		if (current > 0) current--;
	}
</script>

<div class="button-container">
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
