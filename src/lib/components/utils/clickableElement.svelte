<script lang="ts">
	import type { Snippet } from "svelte";

	let { onClickCallback, children }: { onClickCallback: () => void, children: Snippet } = $props();

	function onClick() {
		onClickCallback();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			onClick();
		}
	}
</script>

<div role="button" onclick={onClick} onkeydown={onKeyDown} tabindex="0">
	{@render children()}
</div>