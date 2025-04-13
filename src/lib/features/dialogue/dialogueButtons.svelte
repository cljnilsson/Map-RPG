<script lang="ts">
	import type { Message } from '$lib/types/message';

	let { current = $bindable(), msgs, onEnd }: { current: number; msgs: Message[], onEnd: () => void } = $props();

	function next() {
		const msg = msgs[current];
		if (msg.type === 'text' && msg.next !== undefined) {
			current = msg.next;
			if(onEnd) {
				onEnd();
			}
		}
	}

	function prev() {
		if (current > 0) current--;
	}
</script>

<div class="button-container">
	<button class="btn btn-dark" onclick={prev} disabled={current === 0}>Previous</button>
	<button class="btn btn-dark" onclick={next} disabled={current === msgs.length - 1}>Next</button>
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
