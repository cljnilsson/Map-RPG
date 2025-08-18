<script lang="ts">
	import type { Snippet } from "svelte";

	let { id, first = false, children }: { id: string; first?: boolean; children: Snippet } = $props();
</script>

<div class="tab-pane fade show" class:active={first} id={id} role="tabpanel">
	{@render children()}
</div>
