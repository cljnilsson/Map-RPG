<script lang="ts">
import type { Snippet } from "svelte";
import Tooltip from "$lib/features/tooltip/tooltip.svelte";
let {
	children,
	onClickTooltip,
	disable = false,
}: { children: Snippet; onClickTooltip: Snippet; disable?: boolean } = $props();

let open: boolean = $state(false);
let x = $state(0);
let y = $state(0);
const tooltipPadding = 10; // distance from cursor
const edgeMargin = 25; // extra margin from screen edge

let tooltipEl: HTMLDivElement | null = $state(null);
let tooltipContainerEl: HTMLDivElement | null = $state(null);

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

function onClick(event: MouseEvent) {
	updatePosition(event);

	open = !open; // Toggle
}

function onClickOutside() {
	open = false; // Always hide tooltip if clicking outside of it
}

// Attach listeners when container becomes available
$effect(() => {
	if (!tooltipContainerEl || disable) return;

	tooltipContainerEl.addEventListener("click", onClick);

	return () => {
		tooltipContainerEl?.removeEventListener("click", onClick);
	};
});
</script>

<Tooltip bind:tooltipContainerEl bind:tooltipEl bind:x bind:y show={open && !disable} >
    {#snippet tooltip()}
       	{#if open && !disable}
 			{@render onClickTooltip()}
    	{/if}
    {/snippet}
    {@render children()}
</Tooltip>
