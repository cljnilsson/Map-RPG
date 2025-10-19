<script lang="ts">
	import Outline from "$lib/utils/outline/outline.svelte";
	let {
		src,
		alt = "",
		width = 200,
		height,
		extraClasses = ""
	}: { src: string; alt: string; width: number | string; height?: number | string; extraClasses?: string; } = $props();

	let outline = $state(false);
</script>

<Outline>
	<img
		{src}
		{alt}
		{width}
		class={extraClasses}
		height={height ?? "auto"}
		class:glow={outline}
		onmouseenter={() => (outline = true)}
		onmouseleave={() => (outline = false)}
	/>
</Outline>

<style>
	.glow {
		filter: url(#outline-filter);
		transition: filter 0.3s ease;
	}
</style>
