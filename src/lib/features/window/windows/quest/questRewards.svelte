<script lang="ts">
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Quest } from "$lib/types/quest";

	let { active }: { active: Quest } = $props();
</script>

<div class="rewards">
	<h5>Rewards:</h5>
	{#each active.rewardResources as resource (resource.name)}
		<p>
			<img src={resource.icon} alt={resource.name} />
			{resource.amount}
			{resource.name}
		</p>
	{/each}
	{#each active.rewardItems as item (item.name)}
		<div class="row my-3">
			<div class="col-auto position-relative d-inline-block">
				<Tooltip>
					{#snippet tooltip()}
						<h5>{item.name}</h5>
						<p>{item.description}</p>
						<p>Sells for: 5p</p>
					{/snippet}
					<img src={item.icon} alt={item.name} />
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

<style>
    img {
        width: 48px;
        height: 48px;
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
