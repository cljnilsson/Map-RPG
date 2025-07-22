<script lang="ts">
	import type { Faith } from "$lib/types/faith";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let { faith, selectedFaith = $bindable() }: { faith: Faith; selectedFaith: Faith | undefined } = $props();

	function onClick() {
		if (selectedFaith?.name === faith.name) {
			selectedFaith = undefined;
		} else {
			selectedFaith = faith;
		}
	}
</script>

<div class="col-3">
	<ClickableElement onClickCallback={onClick}>
		<img
			class:selected={faith.name === selectedFaith?.name}
			src={faith.icon}
			alt={"iron representing the " + faith.name + " class"}
			width="100px"
			height="100px"
		/>
	</ClickableElement>
</div>

<style>
	img {
		transition: transform 0.3s ease;
		transform: scale(1);
		filter: grayscale(50%);
	}

	.selected {
		transform: scale(1.2);
		filter: grayscale(0%);
	}
</style>
