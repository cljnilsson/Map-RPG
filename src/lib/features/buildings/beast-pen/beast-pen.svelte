<script lang="ts">
	import { CityController } from "$lib/controller/city.svelte";
	import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import type { Resource } from "$lib/types/resource";
	import type { Building } from "$lib/types/building";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();
</script>

<div class="py-5">
	<!-- Tabs navigation -->
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="attributes-tab" data-bs-toggle="tab" data-bs-target="#attributes" type="button" role="tab"
				>Attributes</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="inventory-tab" data-bs-toggle="tab" data-bs-target="#inventory" type="button" role="tab"
				>Inventory</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="adventures-tab" data-bs-toggle="tab" data-bs-target="#adventures" type="button" role="tab"
				>Adventures</button
			>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="auctions-tab" data-bs-toggle="tab" data-bs-target="#auctions" type="button" role="tab"
				>Auctions</button
			>
		</li>
	</ul>

	<!-- Tabs content -->
	<div class="tab-content mt-3" id="myTabContent">
		<div class="tab-pane fade show active" id="attributes" role="tabpanel">
			<h4>Attributes</h4>
			<p>Attributes content here...</p>
		</div>
		<div class="tab-pane fade" id="inventory" role="tabpanel">
			<h4>Inventory</h4>
			<p>Inventory content here...</p>
		</div>
		<div class="tab-pane fade" id="adventures" role="tabpanel">
			<h4>Adventures</h4>
			<p>Adventures content here...</p>
		</div>
		<div class="tab-pane fade" id="auctions" role="tabpanel">
			<h4>Auctions</h4>
			<p>
				Auctions are used to buy and sell hero items with silver. They’re a reliable way to obtain useful equipment or consumables
				when you need them.
			</p>
		</div>
	</div>
</div>

<style>
	.nav-tabs {
		border-bottom: 1px solid #e5e7eb; /* subtle divider */
	}

	.nav-tabs .nav-link {
		border: 0;
		background: transparent;
		color: #374151; /* gray text for inactive tabs */
	}

	.nav-tabs .nav-link:hover,
	.nav-tabs .nav-link:focus {
		color: #111827; /* darker on hover/focus */
		background: rgba(0, 0, 0, 0.03); /* very light hover fill */
	}

	.nav-tabs .nav-link.active {
		color: #111827; /* dark text */
		background-color: #e9ecef; /* light gray active tab */
		border: 0;
		border-bottom: 1px solid transparent; /* keep the bottom rule continuous */
		box-shadow: inset 0 -1px 0 #e9ecef; /* hides the line under the active tab */
		border-radius: 0.25rem 0.25rem 0 0;
	}
</style>
