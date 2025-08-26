<script lang="ts">
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Snippet } from "svelte";

	let {
		iconPath,
		alt,
		onClickCallback,
		disabled,
		tooltipHtml
	}: { iconPath: string; alt: string; onClickCallback: () => void; disabled: boolean; tooltipHtml: Snippet } = $props();

	function onClick() {
		if(disabled) {
			return;
		}
		console.log("Icon clicked");
		onClickCallback();
	}
</script>

<div class="d-inline-block">
	<ClickableElement onClickCallback={onClick}>
		<Tooltip>
			{#snippet tooltip()}
				{@render tooltipHtml()}
			{/snippet}
			<img src={iconPath} {alt} class:disabled />
		</Tooltip>
	</ClickableElement>
</div>

<style lang="scss">
	.disabled {
		filter: grayscale(100%);
		cursor: not-allowed;
	}

	img {
		transition: transform 0.1s ease;
		transform: scale(1);
		&:hover:not(.disabled) {
			transform: scale(1.2);
		}
	}
</style>
