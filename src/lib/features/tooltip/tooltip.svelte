<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, tooltip }: { children: Snippet; tooltip: Snippet } = $props();

	let hovering: boolean = $state(false);
	let x = $state(0);
	let y = $state(0);

	function onHover(event: MouseEvent) {
		hovering = true;
		updatePosition(event);
	}

	function stopHover() {
		hovering = false;
	}

	function mouseMove(event: MouseEvent) {
		updatePosition(event);
	}

	function updatePosition(event: MouseEvent) {
		x = event.clientX + 15;
		y = event.clientY + 10;
	}
</script>

<div class="tooltip-container" onmouseenter={onHover} onmouseleave={stopHover} onmousemove={mouseMove} role="tooltip">
	{@render children()}
	{#if hovering}
		<div style="top: {y}px; left: {x}px;" class="c-tooltip">{@render tooltip()}</div>
	{/if}
</div>

<style>
	.tooltip-container {
		position: relative;
	}

	.c-tooltip {
		position: fixed; /* changed from absolute */
		border: 1px solid #794F36;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
		background: #E3C9B2;
		border-radius: 4px;
		padding: 4px;
		color: #685247;
		z-index: 9999;
		max-width: 300px;
		white-space: normal;
		word-wrap: break-word;
		min-width: 200px;
		pointer-events: none; /* makes the tooltip ignore mouse events */
	}
</style>
