<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, color = "deepskyblue" }: { children: Snippet; color?: string } = $props();
</script>

<svg width="0" height="0" style="position: absolute;">
	<filter id="outline-filter" x="-10%" y="-10%" width="120%" height="120%">
		<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated" />
		<feComposite in="dilated" in2="SourceAlpha" operator="xor" result="outline" />
		<feFlood flood-color={color} result="flood" />
		<feComposite in="flood" in2="outline" operator="in" result="coloredOutline" />
		<feMerge>
			<feMergeNode in="coloredOutline" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
</svg>

{@render children()}
