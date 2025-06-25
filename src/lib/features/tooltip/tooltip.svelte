<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, tooltip }: {children: Snippet, tooltip: Snippet} = $props();

	let hovering: boolean = $state(false);
	let x = $state(0);
	let y = $state(0);

	function onHover(event: MouseEvent) {
		hovering = true;
		x = event.offsetX + 30;
		y = event.offsetY - 20;
	}

	function stopHover() {
		hovering = false;
	}

	function mouseMove(event: MouseEvent) {
		x = event.offsetX + 30;
		y = event.offsetY - 20;
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
		position: absolute;
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		color: black;
		z-index: 9999;
		max-width: 300px;
		white-space: normal; /* Allows text to wrap */
		word-wrap: break-word;
		min-width: 200px;
	}
</style>
