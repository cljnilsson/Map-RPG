<script lang="ts">
	import "bootstrap/dist/css/bootstrap.min.css";
	import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.js?url";
	import "bootstrap-icons/font/bootstrap-icons.css";
	import "./styles.scss";
	import "animate.css";
	import Nav from "$lib/partials/nav.svelte";
	import type { Snippet } from "svelte";
	import type { LayoutData } from "$lib/types/layoutData";
	import Dialogue from "$lib/features/dialogue/dialogue.svelte";
	import type { Message, CharSprite } from "$lib/types/message";

	let alice: CharSprite = { name: "Vik", image: "vik.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };

	let msgs: Message[] = [
		{ type: "text", text: "Greetings, you're not from here are you?", from: alice },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I've recently arrived, yes." },
				{ text: "I'm not but I know about these lands.", next: 4 }
			]
		},
		{ type: "text", text: "That's alright, but first - who are you?", from: alice },
		{ type: "text", text: "I see, then I wont be your guide.", from: alice }
	];

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

	let tutorialCompleted = $state(getFlagByName("tutorialCompleted"));

	async function onTutorialEnd() {
		// only run this if the user is logged in, TODO
		if (false) {
			await fetch("/api/flag", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "tutorialCompleted",
					value: true
				})
			});
		}
	}
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/facicon.png" />
	<script src={scriptSrc}></script>
</svelte:head>

<div class="container-fluid p-0">
	<Nav {data}></Nav>
	{#if !tutorialCompleted}
		<div
			class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
			style="z-index: 1050; background-color: rgba(0, 0, 0, 0.5);"
		>
			<div style="width: 100%; max-width: 500px;">
				<Dialogue {msgs} player={you} onEnd={onTutorialEnd}></Dialogue>
			</div>
		</div>
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
