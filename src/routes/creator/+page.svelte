<script lang="ts">
	import ImageUploader from "$lib/components/ImageUploader.svelte";
	import CreatorStat from "$lib/features/creator/creatorStat.svelte";
	import Creator from "$lib/features/creator/creator.svelte";

	let name: string = $state("");
	let age: number = $state(18);
	let str: number = $state(5),
		int: number = $state(5),
		vitality: number = $state(5),
		charisma: number = $state(5),
		dex: number = $state(5);
	let total = $derived(str + int + vitality + charisma + dex);
	const min: number = 3,
		max: number = 20,
		totalMax: number = 30;
	let totalLeft = $derived(totalMax - total);
</script>

<Creator />
