<script lang="ts">
import type { Snippet } from "svelte";
import { portal } from "$lib/features/portal/portal.svelte";
import Tooltip from "$lib/features/tooltip/tooltip.svelte";

let {
	children,
	onHoverTooltip,
	disable = false,
}: { children: Snippet; onHoverTooltip: Snippet; disable?: boolean } = $props();

let hovering: boolean = $state(false);
let x = $state(0);
let y = $state(0);

const tooltipPadding = 10; // distance from cursor
const edgeMargin = 25; // extra margin from screen edge

let tooltipEl: HTMLDivElement | null = $state(null);
let tooltipContainerEl: HTMLDivElement | null = $state(null);

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

// Attach listeners when container becomes available
$effect(() => {
	if (!tooltipContainerEl || disable) return;

	tooltipContainerEl.addEventListener("mouseenter", onHover);
	tooltipContainerEl.addEventListener("mouseleave", stopHover);
	tooltipContainerEl.addEventListener("mousemove", mouseMove);

	return () => {
		tooltipContainerEl?.removeEventListener("mouseenter", onHover);
		tooltipContainerEl?.removeEventListener("mouseleave", stopHover);
		tooltipContainerEl?.removeEventListener("mousemove", mouseMove);
	};
});
</script>

<Tooltip bind:tooltipContainerEl bind:tooltipEl bind:x bind:y show={hovering && !disable} >
    {#snippet tooltip()}
       	{#if hovering && !disable}
 			{@render onHoverTooltip()}
    	{/if}
    {/snippet}
    {@render children()}
</Tooltip>

<!--
<div class="tooltip-container" onmouseenter={onHover} onmouseleave={stopHover} onmousemove={mouseMove} role="tooltip">
	{@render children()}

	{#if hovering && !disable}
		<div class="c-tooltip" bind:this={tooltipEl} use:portal={"body"} style="top: {y}px; left: {x}px;">
			{@render tooltip()}
		</div>
	{/if}
</div>-->
