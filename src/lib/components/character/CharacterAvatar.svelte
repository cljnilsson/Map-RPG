<script lang="ts">
	import CharacterStore from '$lib/stores/character.svelte';
	const { height, width }: { height: number; width: number } = $props();
</script>

<img
	src="/char.jpg"
	alt="Your character"
	loading="lazy"
	style="width: {width}px;
        height: {height}px;"
/>
<div
	class="progress mt-2"
	role="progressbar"
	aria-label="Success example"
	aria-valuenow={CharacterStore.character.health}
	aria-valuemin="0"
	aria-valuemax="100"
>
	<div
		class="progress-bar bg-success"
		style="width: {(CharacterStore.character.health / CharacterStore.character.maxHealth) * 100}%"
	>
		{CharacterStore.character.health} / {CharacterStore.character.maxHealth}
	</div>
</div>
