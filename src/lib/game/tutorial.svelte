<script lang="ts">
	import Dialogue from "$lib/features/dialogue/dialogue.svelte";
	import type { Message, CharSprite } from "$lib/types/message";
	import Creator from "$lib/features/creator/creator.svelte";
	import Highlight from "$lib/utils/Highlight.svelte";

	let alice: CharSprite = { name: "Vik", image: "vik.png" };
	let you: CharSprite = { name: "You", image: "char.jpg" };
	let tutorialStage = $state(1);
	let tutorialSubStage = $state(0);
	let creatorSelector: string = $derived.by(() => {
		if (tutorialStage < 2) return "";

		let className = "";

		switch (tutorialSubStage) {
			case 0:
				className = ".c-avatar";
				break;
			case 1:
				className = ".c-body";
				break;
			case 2:
				className = "";
				break;
			case 3:
				className = "";
				break;
			case 4:
				className = ".stat-Str";
				break;
			case 5:
				className = ".stat-Dex";
				break;
			case 6:
				className = ".stat-Int";
				break;
			case 7:
				className = ".stat-Vit";
				break;
			case 8:
				className = ".stat-Charisma";
				break;
			default:
				className = "";
		}

		return className;
	});

	$inspect(tutorialSubStage, creatorSelector);

	let msgs: Message[] = [
		{ type: "text", text: "Greetings, you're not from here are you?", from: alice, next: 1 },
		{
			type: "choice",
			from: you,
			choices: [
				{ text: "I've recently arrived, yes.", next: 2, saveResponse: true },
				{ text: "I'm not but I know about these lands.", next: 3, saveResponse: true }
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
				{ text: "What is 'str' used for?", next: 4, saveResponse: false },
				{ text: "What is 'Dex' used for?", next: 5, saveResponse: false },
				{ text: "What is 'Int' used for?", next: 6, saveResponse: false },
				{ text: "What is 'Vit' used for?", next: 7, saveResponse: false },
				{ text: "What is 'Charisma' used for?", next: 8, saveResponse: false },
				{ text: "I have no questions", next: 9, saveResponse: false }
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

	let dialogueRef: Dialogue | null = $state(null);

	async function onTutorialEnd() {
		console.log("THE TUTORIAL IS OVER");
		activeDialogue = creatorDialogue;
		tutorialSubStage = 0;
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

{#if tutorialStage === 1}
	<Dialogue
		bind:this={dialogueRef}
		bind:msgs={activeDialogue}
		player={you}
		onEnd={onTutorialEnd}
		bind:current={tutorialSubStage}
	/>
{:else if tutorialStage === 2}
	<Dialogue
		bind:this={dialogueRef}
		bind:msgs={activeDialogue}
		player={you}
		onEnd={onTutorialEnd}
		bind:current={tutorialSubStage}
	>
		{#snippet leftCol()}
			{#if tutorialStage === 2}
				<div class="col-xl-6">
					<Highlight selector={creatorSelector}>
						<Creator />
					</Highlight>
				</div>
			{/if}
		{/snippet}
	</Dialogue>
{/if}
