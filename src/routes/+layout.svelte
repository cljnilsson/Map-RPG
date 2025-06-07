<script lang="ts">
	import "bootstrap/dist/css/bootstrap.min.css";
	import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.js?url";
	import "bootstrap-icons/font/bootstrap-icons.css";
	import "./styles.scss";
	import "animate.css";
	import Nav from "$lib/partials/nav.svelte";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "$lib/types/layoutData";
	import Tutorial from "$lib/game/tutorial.svelte";

	let { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();


	let flags: { name: string; value: boolean }[] = $derived(
		data?.userFlags.map((flag: { name: string; value: number }) => ({
			name: flag.name,
			value: flag.value === 1
		})) ?? []
	);

	function getFlagByName(name: string): boolean | undefined {
		return flags.find((flag) => flag.name === name)?.value;
	}

	let tutorialCompleted = true;//$state(getFlagByName("tutorialCompleted"));
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/facicon.png" />
	<script src={scriptSrc}></script>
</svelte:head>

<div class="container-fluid p-0">
	<Nav {data}></Nav>
	{#if !tutorialCompleted}
		<Tutorial />
	{/if}
	{@render children()}
</div>

<style>
	.container-fluid {
		min-height: 100%;
		background-image: url("/bg.jpg");
		background-size: cover;
		background-repeat: repeat-y;
	}
</style>
