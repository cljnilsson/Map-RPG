<script lang="ts">
	import {PlayerController} from "#lib/controller/character.svelte.js";
	import { xpToNextLevel } from "#lib/utils/xp.js";
	import ProgressBar from "#lib/components/progressBar.svelte";
	import type { Snippet } from "svelte";

	const {
		height = 200,
		width = 200,
		overlay,
		onClickCallback = () => {}
	}: { height: number; width: number; onClickCallback?: () => void; overlay?: Snippet } = $props();

</script>

<div class="avatar position-relative" style:width={`${width}px`}>
<button type="button" class="d-block border-0 p-0 bg-transparent" onclick={onClickCallback}>
	<img
		src={PlayerController.imagePath}
		alt="Your character"
		loading="lazy"
		fetchpriority="high"
		style="width: {width}px;
        height: {height}px;"
	/>
</button>
	<span class="level-badge position-absolute bottom-0 end-0 m-1 rounded px-2">
		<span class="visually-hidden">Level </span>{PlayerController.level}
	</span>
	{#if overlay}
		{@render overlay()}
	{/if}
</div>
<ProgressBar val={PlayerController.health / PlayerController.maxHealth} text={PlayerController.health + " / " + PlayerController.maxHealth} color={"bg-success"} />
<ProgressBar val={PlayerController.xp / xpToNextLevel(PlayerController.level, PlayerController.xp)} text={PlayerController.xp + " / " + xpToNextLevel(PlayerController.level, PlayerController.xp)} color={"bg-purple"} />

<style lang="scss">
	.avatar {
		.level-badge {
			color: white;
			background: rgb(0 0 0 / 75%);
			box-shadow: 0 1px 4px rgb(0 0 0 / 60%);
			font-weight: 700;
			pointer-events: none;
		}
	}
</style>
