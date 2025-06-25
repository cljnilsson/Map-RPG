<script lang="ts">
	import type { Quest } from "$lib/types/quest";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import QuestDialogue from "$lib/components/windows/quest/questDialogue.svelte";

	let { active = $bindable() }: { active: Quest } = $props();

	let showDialogue = $state(false);

	function toggleDialogue() {
		showDialogue = !showDialogue;
	}
</script>

<h5>{active.title}</h5>
{#if !showDialogue}
	<div class="questBody">
		<p>{active.description}</p>
		<div class="py-3">
			<ul>
				<li class="muted">Start the quest</li>
				<li>Complete the quest</li>
			</ul>
		</div>
	</div>
	<div class="rewards">
		<h5>Rewards:</h5>
		{#each active.rewardResources as resource}
			<p>
				<img src={resource.icon} alt={resource.name} width="48" height="48" />
				{resource.amount}
				{resource.name}
			</p>
		{/each}
		{#each active.rewardItems as item}
			<div class="row my-3">
				<div class="col-auto position-relative d-inline-block">
					<Tooltip>
						{#snippet tooltip()}
							<h5>{item.name}</h5>
							<p>{item.description}</p>
							<p>Sells for: 5p</p>
						{/snippet}
						<img src={item.icon} alt={item.name} width="48" height="48" />
						<h4 class="item-amount">{item.amount}</h4>
					</Tooltip>
				</div>
				<div class="col ps-0 d-flex align-items-center">
					<b>{item.name}</b>
				</div>
			</div>
		{/each}
		<p>{active.rewardMisc}</p>
	</div>
{:else}
	<QuestDialogue {active} />
{/if}
<div class="text-center pt-3">
	{#if active.dialogue}
		<button class="btn btn-primary" onclick={toggleDialogue}>{showDialogue ? "View Quest" : "View Dialogue"}</button>
	{/if}
	<button class="btn btn-primary">Forfeit</button>
</div>

<style>
	.muted {
		color: rgba(150, 150, 150) !important;
	}

	.position-relative {
		position: relative;
	}

	.item-amount {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		margin: 0;
		padding: 2px 5px;
		font-size: 0.9rem;
		color: white;
		background-color: rgba(0, 0, 0, 0.6); /* optional */
		border-radius: 3px; /* optional */
		pointer-events: none;
	}

	h5 {
		color: rgb(255, 167, 43);
	}
</style>
