<script lang="ts">
	import type { Building } from "$lib/types/building";

	const { level, building }: {level: number, building: Omit<Building, "componentOnClick">} = $props();
	let base = 1000;
	let capacity = $derived(base + 200 * level); // add this to a svelte store
</script>

<p>Current capacity: <b>{capacity}</b></p>
