<script lang="ts">
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";

	let { iconPath, alt, onClickCallback, disabled }: { iconPath: string; alt: string, onClickCallback: () => void, disabled: boolean } = $props();

	function onClick() {
		console.log("Icon clicked");
		onClickCallback();
	}
</script>

<div class="d-inline-block">
	<ClickableElement onClickCallback={onClick}>
		<Tooltip>
			{#snippet tooltip()}
				<p>ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</p>
			{/snippet}
			<img src={iconPath} {alt} class:disabled={disabled} />
		</Tooltip>
	</ClickableElement>
</div>

<style>
	.disabled {
		filter: grayscale(100%);
	}
</style>
