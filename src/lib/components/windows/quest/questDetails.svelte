<script lang="ts">
	import type { Quest } from "$lib/types/quest";

	let { active = $bindable() }: { active: Quest } = $props();
</script>

<h5>{active.title}</h5>
<div class="questBody">
	<p>{active.description}</p>
</div>
<div class="rewards">
	<h5>Rewards:</h5>
	{#each active.rewardResources as resource}
		<p>
			<img src={resource.icon} alt={resource.name} width="20" height="20" />
			{resource.amount} {resource.name}
		</p>
	{/each}
	{#each active.rewardItems as item}
		<p>
			<img src={item.icon} alt={item.name} width="20" height="20" />
			{item.amount} {item.name}
		</p>
	{/each}
	<p>{active.rewardMisc}</p>
</div>
<div class="text-center pt-3">
	<button class="btn btn-primary">View Dialogue</button>
	<button class="btn btn-primary">Forfeit</button>
</div>

<style>
	h5 {
		color: rgb(255, 167, 43)
	}
</style>