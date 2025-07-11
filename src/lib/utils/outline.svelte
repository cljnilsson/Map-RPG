<script lang="ts">
	let { src, alt = "", width = 200 }: { src: string; alt: string; width: number } = $props();
</script>

<svg width="0" height="0" style="position: absolute;">
	<filter id="outline-filter" x="-10%" y="-10%" width="120%" height="120%">
		<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated" />
		<feComposite in="dilated" in2="SourceAlpha" operator="xor" result="outline" />
		<feFlood flood-color="deepskyblue" result="flood" />
		<feComposite in="flood" in2="outline" operator="in" result="coloredOutline" />
		<feMerge>
			<feMergeNode in="coloredOutline" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
</svg>

<img
	class="outline-hover"
	{src}
	{alt}
	{width}
	style="transition: filter 0.3s ease;"
	onmouseenter={(e) => (e.currentTarget.style.filter = "url(#outline-filter)")}
	onmouseleave={(e) => (e.currentTarget.style.filter = "none")}
/>

<style>
	.outline-hover {
		display: block;
	}
</style>
