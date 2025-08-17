<script lang="ts">
	import type { Snippet } from "svelte";

	let { id, children }: { id: string; children: Snippet } = $props();
</script>

<div class="tab-pane fade show active" id={id} role="tabpanel">
	{@render children()}
</div>
