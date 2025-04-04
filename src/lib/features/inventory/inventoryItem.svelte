<script lang="ts">
	import type { Item } from '$lib/types/item';

	let {
		inventory = $bindable(),
		selectedItem = $bindable(),
		item
	}: { inventory: Item[]; selectedItem: Item | null; item: Item } = $props();

	function onSelect() {
		if(selectedItem === item) {
			selectedItem = null;
			return;
		}
		selectedItem = item;
	}
</script>

<div class="col-1">
	<div
		role="button"
		tabindex="0"
		class="inv text-center"
		class:active={item?.name === selectedItem?.name && item != null}
		onclick={onSelect}
		onkeydown={() => {
			onSelect();
		}}
		aria-pressed={item === selectedItem}
	>
		<small>{item?.name}</small>
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
		position: relative; // Make it the reference for absolute positioning

		&.active {
			box-shadow: inset 0 0 0 2px red;
		}

		small {
			position: absolute;
			top: 2px; // Adjust as needed
			left: 50%;
			transform: translateX(-50%);
			font-size: 0.75rem;
			white-space: nowrap;
		}

		i {
			font-size: 3.6rem;
			display: block; // Ensures it centers properly
			&:hover {
				cursor: pointer;
				color: red;
			}
		}
	}
</style>
