<script lang="ts">
	import { Tween } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import type { Snippet } from "svelte";
	import { onMount, onDestroy } from "svelte";
	import Title from "$lib/features/window/windowTitle.svelte";
	import Body from "$lib/features/window/windowBody.svelte";
	import Footer from "$lib/features/window/windowFooter.svelte";
	import DraggableHandle from "$lib/utils/DraggableHandle.svelte";
	import { browser } from "$app/environment";

	let {
		title,
		body,
		footer,
		width,
		height,
		x,
		y,
		toggleKey,
		visibility = $bindable(true)
	}: {
		title: Snippet;
		body: Snippet;
		footer: Snippet;
		width: number;
		height: number;
		x: number;
		y: number;
		toggleKey?: string;
		visibility?: boolean;
	} = $props();

	let expanded = $state(true);
	let locked = $state(false);

	let containerElement: HTMLElement;

	const tweenHeight = new Tween(height, { duration: 100, easing: cubicOut });

	$effect(() => {
		console.log(tweenHeight);
	});

	function toggle() {
		expanded = !expanded;
		tweenHeight.set(expanded ? height : 0);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === toggleKey) {
			visibility = !visibility;
		}
	}

	onMount(() => {
		if (toggleKey && window) {
			window.addEventListener("keydown", handleKeydown);
		}
	});

	onDestroy(() => {
		if (browser) {
			if (toggleKey) {
				window.removeEventListener("keydown", handleKeydown);
			}
		}
	});
</script>

<div
	bind:this={containerElement}
	class="overlay-rect"
	style="left: {x}px; top: {y}px; width: {width}px;"
	class:d-none={!visibility}
>
	<DraggableHandle bind:x bind:y containerWrapper={".overlay-rect"} {locked}>
		<Title>
			<div class="row align-items-center">
				<div class="col">
					{@render title()}
				</div>
				<div class="col-auto text-end">
					<button
						class="btn btn-sm btn-outline-secondary"
						aria-label="Lock/Unlock"
						onclick={() => (locked = !locked)}
					>
						<i class="bi {locked ? "bi-unlock" : "bi-lock-fill"}"></i>
					</button>
					<button
						class="btn btn-sm btn-outline-secondary"
						aria-label="Minimize"
						onclick={toggle}
					>
						<i class="bi {expanded ? "bi-dash" : "bi-plus"}"></i>
					</button>
				</div>
			</div>
		</Title>
	</DraggableHandle>

	<!-- Manually animated height using tween -->
	<div class="content-wrapper" style="height: {tweenHeight.current}px;">
		<div class="inner d-flex flex-column h-100">
			<Body>{@render body()}</Body>
			<Footer>{@render footer()}</Footer>
		</div>
	</div>
</div>

<style>
	.overlay-rect {
		position: fixed;
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
