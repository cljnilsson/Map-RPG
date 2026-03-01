<script lang="ts">
	import {PlayerController} from "$lib/controller/character.svelte";
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
		src={PlayerController.imagePath}
		alt="Your character"
		loading="lazy"
		fetchpriority="high"
		style="width: {width}px;
        height: {height}px;"
	/>
</div>
<ProgressBar val={PlayerController.health / PlayerController.maxHealth} text={PlayerController.health + " / " + PlayerController.maxHealth} color={"bg-success"} />
<ProgressBar val={PlayerController.xp / xpToNextLevel(PlayerController.level, PlayerController.xp)} text={PlayerController.xp + " / " + xpToNextLevel(PlayerController.level, PlayerController.xp)} color={"bg-purple"} />
