<script lang="ts">
	import type { Item } from "$lib/types/item";

	let {
		inventory = $bindable(),
		selectedItem = $bindable(),
		item
	}: { inventory: Item[]; selectedItem: Item | null; item: Item } = $props();

	function onSelect() {
		if (selectedItem === item) {
			selectedItem = null;
			return;
		}
		selectedItem = item;
	}
</script>

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
	{#if item}
		{#if item.amount > 1}
			<small>{item.amount}</small>
		{/if}
		{#if item.iconPath}
			<img src={item.iconPath} alt={item.name} width="64" height="64" />
		{:else}
			<i class={item.iconClass}></i>
		{/if}
	{/if}
</div>

<style lang="scss">
	.inv {
		background-color: grey;
		width: 64px;
		height: 64px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		&.active {
			box-shadow: inset 0 0 0 2px red;
		}

		small {
			position: absolute;
			top: 2px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 0.75rem;
			white-space: nowrap;
		}

		i {
			font-size: 48px; // Slightly smaller to fit inside 64px
			width: 64px;
			height: 64px;
			line-height: 64px;
			text-align: center;
			display: inline-block;

			&:hover {
				cursor: pointer;
				color: red;
			}
		}
	}
</style>
