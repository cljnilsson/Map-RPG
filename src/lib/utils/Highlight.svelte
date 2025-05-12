<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, selector = "" }: { children: Snippet; selector?: string } = $props();

	let container: HTMLElement;
	let previousTarget: Element | null = $state(null);

	function highlightTarget() {
		if (previousTarget) {
			previousTarget.classList.remove("highlight-pulse");
		}

		if (!selector || !container) return;

		const target = container.querySelector(selector);
		if (target) {
			target.classList.add("highlight-pulse");
			previousTarget = target;
		} else {
			previousTarget = null;
		}
	}

	$effect(() => {
		highlightTarget();
	});
</script>

<div class:highlight-pulse={!selector && selector !== ""} bind:this={container}>
	{@render children()}
</div>
