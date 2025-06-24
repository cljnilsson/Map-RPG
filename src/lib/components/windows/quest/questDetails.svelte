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
	<p>{active.reward}</p>
</div>
<div class="text-center">
	<button class="btn btn-primary">View Dialogue</button>
	<button class="btn btn-primary">Forfeit</button>
</div>

<style>
	h5 {
		color: rgb(255, 167, 43)
	}
</style>