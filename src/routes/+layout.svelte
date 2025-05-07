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
	let tutorialStage = $state(1);

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
		{
			type: "text",
			text: "I see, then I wont be your guide. However I still wonder who you are.",
			from: alice,
			next: -1
		}
	];

	let creatorDialogue: Message[] = [
		{ type: "text", text: "First, let me get a good look at you", from: alice, next: 1 },
		{
			type: "text",
			text: "Good, now disribute your skill points as you see fit. It is probably easier if you keep it a relatively even spread but don't let me stop you.",
			from: alice,
			next: 2
		},
		{ type: "text", text: "If you have questions let me explain.", from: alice, next: 3 },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "What is 'str' used for?", next: 4 },
				{ text: "What is 'Dex' used for?", next: 5 },
				{ text: "What is 'Int' used for?", next: 6 },
				{ text: "What is 'Vit' used for?", next: 7 },
				{ text: "What is 'Charisma' used for?", next: 8 },
				{ text: "I have no questions", next: 9 }
			]
		},
		{
			type: "text",
			text: "Strength increase your damage with physical weapons or using brute force to help you on your journey.",
			from: alice,
			next: 3
		},
		{
			type: "text",
			text: "Dexterity allows you easily dodge attacks or traps along with crafting handy items.",
			from: alice,
			next: 3
		},
		{
			type: "text",
			text: "Intelligence allows you to come up with new creative ways to tackle a problem ahead of you.",
			from: alice,
			next: 3
		},
		{
			type: "text",
			text: "Vitality allows you to take more of a beating in combat",
			from: alice,
			next: 3
		},
		{
			type: "text",
			text: "Charisma allows you to manipulate people to align with your goals and whims.",
			from: alice,
			next: 3
		},
		{ type: "text", text: "Finally, what's your name?", from: alice, next: -1 }
	];

	let activeDialogue: Message[] = $state(msgs);

	let { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();

	let dialogueRef: Dialogue | null = $state(null);

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
		activeDialogue = creatorDialogue;
		tutorialStage = 2;
		//dialogueRef?.reset();
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
		{#if tutorialStage === 1}
			<Dialogue
				bind:this={dialogueRef}
				bind:msgs={activeDialogue}
				player={you}
				onEnd={onTutorialEnd}
			/>
		{:else if tutorialStage === 2}
			<Dialogue
				bind:this={dialogueRef}
				bind:msgs={activeDialogue}
				player={you}
				onEnd={onTutorialEnd}
			>
				{#snippet leftCol()}
					{#if tutorialStage === 2}
						<div class="col-xl-6">
							<Creator />
						</div>
					{/if}
				{/snippet}
			</Dialogue>
		{/if}
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
