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
	import Creator from "$lib/features/creator/creator.svelte";

	let alice: CharSprite = { name: "Vik", image: "vik.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };

	let msgs: Message[] = [
		{ type: "text", text: "Greetings, you're not from here are you?", from: alice, next: 1 },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I've recently arrived, yes.", next: 2 },
				{ text: "I'm not but I know about these lands.", next: 3 }
			]
		},
		{ type: "text", text: "That's alright, but first - who are you?", from: alice, next: -1 },
		{ type: "text", text: "I see, then I wont be your guide. However I still wonder who you are.", from: alice, next: -1 }
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
		console.log("THE TUTORIAL IS OVER");
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
		<!-- Key attribute in order to automatically reset the dialogue when msgs is changed -->
		{#key msgs}
			<Dialogue {msgs} player={you} onEnd={onTutorialEnd}>
				{#snippet leftCol()}
					<div class="col-xl-6">
						<Creator />
					</div>
				{/snippet}
			</Dialogue>
		{/key}
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
