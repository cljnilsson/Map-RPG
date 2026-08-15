<script lang="ts">
	import MapController from "#lib/controller/map.svelte.js";
	import type { MapWithClickBox } from "#lib/types/mapTypes.js";

	let {
		label,
		rect,
		onClickCallback,
		selectedBox
	}: {
		label?: number;
		rect: MapWithClickBox;
		onClickCallback?: (clicked: MapWithClickBox) => void;
		selectedBox: MapWithClickBox | null;
	} = $props();

	let buttonEl: HTMLButtonElement | null = $state(null);

	function isInViewport(el: HTMLElement | null): boolean {
		if (!el) return false;
		const r = el.getBoundingClientRect();
		return (
			r.bottom >= 0 &&
			r.right >= 0 &&
			r.top <= (window.innerHeight || document.documentElement.clientHeight) &&
			r.left <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	// Run an effect when dependencies change
	$effect(() => {
		const isHovered = MapController.currentNavigationHover?.map.name === rect.map.name;
		if (isHovered && buttonEl && !isInViewport(buttonEl)) {
			buttonEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	});

	function onClick(rect: MapWithClickBox) {
		if (onClickCallback) {
			onClickCallback(rect);
		}
	}
</script>

<button
    type="button"
	bind:this={buttonEl}
	class="overlay-rect"
	class:overlay-rect-editing={selectedBox?.map.name === rect.map.name}
	class:overlay-rect-edit-passive={MapController.editMode && selectedBox?.map.name !== rect.map.name}
	class:overlay-rect-navigation={MapController.currentNavigationHover?.map.name === rect.map.name}
	onclick={() => onClick(rect)}
	style="
        width: {rect.clickBox.width}px;
        height: {rect.clickBox.height}px;
        transform: rotate({rect.clickBox.rotation}deg);
        position: relative;
    "
	aria-label={`Clickable area for ${rect.map.name}`}
>
	{#if label !== undefined}
		<span class="box-label" aria-hidden="true">{label}</span>
	{/if}
</button>

<style>
	.overlay-rect,
	.overlay-rect-editing {
		position: absolute;
		border: 2px solid red;
		background-color: rgba(255, 0, 0, 0.2);
		cursor: pointer;
	}

	.overlay-rect-edit-passive {
		border-color: orange !important;
		background-color: rgba(250, 70, 0, 0.2) !important;
	}

	.overlay-rect-editing {
		border-color: green;
		background-color: rgba(0, 255, 0, 0.2);
	}

	.overlay-rect-navigation {
		border-color: yellow !important;
		background-color: rgba(255, 255, 0, 0.2) !important;
	}

	.box-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 1px 3px #000;
	}
</style>
