<script lang="ts">
	import Outline from "$lib/utils/outline/outline.svelte";
	let {
		src,
		alt = "",
		width = 200,
		height,
		extraClasses = "",
		outline,
		color = "deepskyblue"
	}: { src: string; alt: string; width: number | string; height?: number | string; extraClasses?: string; outline: boolean, color?: string } = $props();
</script>


<Outline {color}>
	<img
		{src}
		{alt}
		{width}
		class:glow={outline}
		class={extraClasses}
		height={height ?? "auto"}
	/>
</Outline>

<style>
	.glow {
		filter: url(#outline-filter);
	}
</style>
