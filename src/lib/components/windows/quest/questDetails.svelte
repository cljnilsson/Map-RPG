<script lang="ts">
	import type { Quest } from "$lib/types/quest";

	let { active = $bindable() }: { active: Quest } = $props();
</script>

<h5>{active.title}</h5>
<p>{active?.description ?? ""}</p>
<h5>Rewards:</h5>
<p>{active.reward}</p>
<button>View Dialogue</button>