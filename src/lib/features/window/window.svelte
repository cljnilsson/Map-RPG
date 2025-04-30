<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';
	import Title from '$lib/features/window/windowTitle.svelte';
	import Body from '$lib/features/window/windowBody.svelte';
	import Footer from '$lib/features/window/windowFooter.svelte';
	import DraggableHandle from '$lib/utils/DraggableHandle.svelte';

	let {
		title,
		body,
		footer,
		width,
		x,
		y
	}: {
		title: Snippet;
		body: Snippet;
		footer: Snippet;
		width: number;
		x: number;
		y: number;
	} = $props();

	let expanded = $state(true);
	const fullHeight = 300; // adjust to match full height of content
	const tweenHeight = tweened(fullHeight, {
		duration: 300,
		easing: cubicOut
	});

	function toggle() {
		expanded = !expanded;
		tweenHeight.set(expanded ? fullHeight : 0);
	}
</script>

<div
	class="overlay-rect"
	style="left: {x}px; top: {y}px; width: {width}px;"
>
<DraggableHandle bind:x bind:y containerWrapper=".overlay-rect">
	<Title>
		<div class="row align-items-center">
			<div class="col-10">
				{@render title()}
			</div>
			<div class="col-2 text-end">
				<button
					class="btn btn-sm btn-outline-secondary"
					aria-label="Minimize"
					onclick={toggle}
				>
					<i class="bi {expanded ? 'bi-dash' : 'bi-plus'}"></i>
				</button>
			</div>
		</div>
	</Title>
</DraggableHandle>


	<!-- Manually animated height using tween -->
	<div
		class="content-wrapper"
		style="height: {$tweenHeight}px;"
	>
		<div class="inner">
			<Body>{@render body()}</Body>
			<Footer>{@render footer()}</Footer>
		</div>
	</div>
</div>

<style>
	.overlay-rect {
		position: absolute;
		border: 2px solid black;
		border-radius: 10px;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		overflow: hidden;
	}

	.content-wrapper {
		overflow: hidden;
		transition: height 0.3s ease; /* optional, helps with small glitches */
	}

	.inner {
		padding: 0.5rem;
	}
</style>
