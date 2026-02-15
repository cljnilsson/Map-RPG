<script lang="ts">
import type { Snippet } from "svelte";
import { portal } from "$lib/features/portal/portal.svelte";

let {
	children,
	tooltip,
	show = false,
	x = $bindable(),
	y = $bindable(),
	tooltipEl = $bindable(),
	tooltipContainerEl = $bindable(),
}: {
	children: Snippet;
	tooltip: Snippet;
	show: boolean;
	x: number;
	y: number;
	tooltipEl: HTMLDivElement | null;
	tooltipContainerEl: HTMLDivElement | null;
} = $props();
</script>

<div class="tooltip-container" bind:this={tooltipContainerEl} role="tooltip">
	{@render children()}
	{#if show}
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
