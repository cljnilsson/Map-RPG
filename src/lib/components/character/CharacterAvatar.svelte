<script lang="ts">
	import CharacterStore from "$lib/stores/character.svelte";
	import { xpToNextLevel } from "$lib/utils/xp";

	const {
		height = 200,
		width = 200,
		onClickCallback = () => {}
	}: { height: number; width: number; onClickCallback?: () => void } = $props();

	function onEnter(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			onClickCallback();
		}
	}
</script>

<div onclick={onClickCallback} tabindex="0" role="button" onkeydown={onEnter}>
	<img
		src="/char.jpg"
		alt="Your character"
		loading="lazy"
		fetchpriority="high"
		style="width: {width}px;
        height: {height}px;"
	/>
</div>
<div
	class="progress mt-2"
	role="progressbar"
	aria-label="Character health bar"
	aria-valuenow={CharacterStore.character.health}
	aria-valuemin="0"
	aria-valuemax="100"
>
	<div class="progress-bar bg-success" style="width: {(CharacterStore.character.health / CharacterStore.character.maxHealth) * 100}%">
	</div>

	<span class="text-center w-100">
        {CharacterStore.character.health} / {CharacterStore.character.maxHealth}
    </span>
</div>
<div
	class="progress mt-2"
	role="progressbar"
	aria-label="Character XP bar"
	aria-valuenow={CharacterStore.character.health}
	aria-valuemin="0"
	aria-valuemax="100"
>
	<div class="progress-bar bg-purple" style="width: {(CharacterStore.character.xp / xpToNextLevel(CharacterStore.character.level, CharacterStore.character.xp)) * 100}%">
	</div>

	<span class="text-center w-100">
	    {CharacterStore.character.xp} / {xpToNextLevel(CharacterStore.character.level, CharacterStore.character.xp)}
    </span>
</div>

<style>
	.bg-purple {
		background-color: rgb(173, 51, 255);
	}
</style>
