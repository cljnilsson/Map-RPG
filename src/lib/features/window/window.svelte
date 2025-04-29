<script lang="ts">
	import type { Snippet } from 'svelte';
	import Title from '$lib/features/window/windowTitle.svelte';
	import Body from '$lib/features/window/windowBody.svelte';
	import Footer from '$lib/features/window/windowFooter.svelte';
	import DraggableHandle from '$lib/utils/DraggableHandle.svelte';

	let {title, body, footer, width, height}: {title: Snippet, body: Snippet, footer: Snippet, width: number, height: number} = $props();
	let x: number = $state(200);
	let y: number = $state(200);
</script>

<div class="overlay-rect" style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;">
	<DraggableHandle bind:x={x} bind:y={y} onDragStart={() => {}} onDragEnd={() => {}} containerWrapper=".overlay-rect">
		<Title>
			{@render title()}
		</Title>
	</DraggableHandle>
	<Body>
		{@render body()}
	</Body>
	<Footer>
		{@render footer()}
	</Footer>
</div>

<style>
	.overlay-rect {
		position: absolute;
		border: 2px solid black;
		border-radius: 10px;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
	}
</style>
