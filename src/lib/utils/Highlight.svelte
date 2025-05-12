<script lang="ts">
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";

	let { children, selector = "" }: {children: Snippet, selector?: string} = $props();

	let container: HTMLElement;

	function highlightTarget() {
		if (!selector || !container || selector === "") return;

		const target = container.querySelector(selector);

		if (target) {
			target.classList.add("highlight-pulse");
		}
	}

	onMount(highlightTarget);
</script>

<div class:highlight-pulse={!selector && selector !== ""} bind:this={container}>
	{@render children()}
</div>