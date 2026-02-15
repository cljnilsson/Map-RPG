<script lang="ts">
import ClickableElement from "$lib/components/utils/clickableElement.svelte";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import type { Snippet } from "svelte";
import StaticOutlineImage from "$lib/utils/outline/staticOutline.svelte";

let {
	iconPath,
	alt,
	onClickCallback,
	disabled,
	tooltipHtml,
	currentlyActive,
}: {
	iconPath: string;
	alt: string;
	onClickCallback: () => void;
	disabled: boolean;
	tooltipHtml: Snippet;
	currentlyActive: boolean;
} = $props();

function onClick() {
	if (disabled) {
		return;
	}
	console.log("Icon clicked");
	onClickCallback();
}
</script>

<div class="d-inline-block">
	<ClickableElement onClickCallback={onClick}>
		<Tooltip>
			{#snippet onHoverTooltip()}
				{@render tooltipHtml()}
			{/snippet}

			{#if disabled}
				<img src={iconPath} class="disabled" alt={alt} height={64} width={64}  />
			{:else}
				<StaticOutlineImage src={iconPath} alt={alt} height={64} width={64} outline={currentlyActive} color="red" />
			{/if}
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
