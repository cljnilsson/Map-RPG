<script lang="ts">
	import type {Item} from "$lib/types/item";
	
	let {inventory = $bindable(), item}: {inventory: Item[], item: Item} = $props();
</script>

<div class="col-1">
	<div class="inv text-center">
		{#if item}
			<i class={item.iconClass}></i>
		{/if}
	</div>
</div>

<style lang="scss">
	.inv {
		background-color: grey;
		aspect-ratio: 1 / 1; /* Keeps height equal to width */
		width: 100%;
		i {
			font-size: 3.6rem;
			&:hover {
				cursor: pointer;
				color: red;
			}
		}
	}
</style>
