<script lang="ts">
	import CharacterStore from "$lib/stores/character.svelte";
	import { xpToNextLevel } from "$lib/utils/xp";
	import ProgressBar from "$lib/components/progressBar.svelte";

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
<ProgressBar val={CharacterStore.character.health / xpToNextLevel(CharacterStore.character.level, CharacterStore.character.xp)} text={CharacterStore.character.health + " / " + CharacterStore.character.maxHealth} color={"bg-success"} />
<ProgressBar val={CharacterStore.character.xp / xpToNextLevel(CharacterStore.character.level, CharacterStore.character.xp)} text={CharacterStore.character.xp + " / " + xpToNextLevel(CharacterStore.character.level, CharacterStore.character.xp)} color={"bg-purple"} />
