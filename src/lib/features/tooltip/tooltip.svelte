<script lang="ts">
	import type { Snippet } from "svelte";
	import { portal } from "$lib/features/portal/portal.svelte";

	let { children, tooltip, disable = false }: { children: Snippet; tooltip: Snippet, disable?: boolean } = $props();

	let hovering: boolean = $state(false);
	let x = $state(0);
	let y = $state(0);

	const tooltipPadding = 10; // distance from cursor
	const edgeMargin = 25; // extra margin from screen edge

	let tooltipEl: HTMLDivElement | null = $state(null);

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
		const mouseX = event.clientX + tooltipPadding;
		const mouseY = event.clientY + tooltipPadding;

		if (tooltipEl) {
			const rect = tooltipEl.getBoundingClientRect();

			// Clamp x
			const maxX = window.innerWidth - rect.width - edgeMargin;
			x = Math.min(mouseX, maxX);

			// Clamp y
			const maxY = window.innerHeight - rect.height - edgeMargin;
			y = Math.min(mouseY, maxY);
		} else {
			// fallback if tooltip not yet rendered
			x = mouseX;
			y = mouseY;
		}
	}
</script>

<div class="tooltip-container" onmouseenter={onHover} onmouseleave={stopHover} onmousemove={mouseMove} role="tooltip">
	{@render children()}

	{#if hovering && !disable}
		<div class="c-tooltip" bind:this={tooltipEl} use:portal={"body"} style="top: {y}px; left: {x}px;">
			{@render tooltip()}
		</div>
	{/if}
</div>

<style>
	.tooltip-container {
		position: relative;
	}
	.c-tooltip {
		position: fixed;
		border: 1px solid #794f36;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
		background: #e3c9b2;
		border-radius: 4px;
		padding: 4px;
		color: #685247;
		z-index: 9999;
		max-width: 300px;
		white-space: normal;
		word-wrap: break-word;
		min-width: 100px;
		max-width: 300px;
		pointer-events: none;
	}
</style>
