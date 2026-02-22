<script lang="ts">
	import type { Snippet } from "svelte";
	type Tab = { title: string; target: string };

	let { tabs = [] as Tab[], children }: { tabs: Tab[]; children: Snippet } = $props();
</script>

<ul class="nav nav-tabs">
	{#each tabs as tab, i}
		<li class="nav-item">
			<button type="button" class="nav-link" class:active={i === 0} data-bs-toggle="tab" data-bs-target={"#" + tab.target}>
				{tab.title}
			</button>
		</li>
	{/each}
</ul>

<div class="tab-content mt-3">
    {@render children()}
</div>

<style>
	.nav-tabs {
		border-bottom: 1px solid #e5e7eb;
	}
	.nav-tabs .nav-link {
		border: 0;
		background: transparent;
		color: #374151;
	}
	.nav-tabs .nav-link:hover,
	.nav-tabs .nav-link:focus {
		color: #111827;
		background: rgba(0, 0, 0, 0.03);
	}
	.nav-tabs .nav-link.active {
		color: #111827;
		background-color: #e9ecef;
		border: 0;
		border-bottom: 1px solid transparent;
		box-shadow: inset 0 -1px 0 #e9ecef;
		border-radius: 0.25rem 0.25rem 0 0;
	}
</style>
