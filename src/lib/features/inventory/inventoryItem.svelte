<script lang="ts">
	import type { Item } from "$lib/types/item";
	import { isUsableInventoryItem, isInventoryItem } from "$lib/typeguards/item";

	let {
		inventory = $bindable(),
		selectedItem = $bindable(),
		item,
		currentSearchTerm
	}: { inventory: Item[]; selectedItem: Item | null; item: Item, currentSearchTerm: string } = $props();

	function onSelect() {
		if (selectedItem === item) {
			selectedItem = null;
			return;
		}
		selectedItem = item;
	}

	function onClick(e: MouseEvent) {
		e.preventDefault();
		if (isUsableInventoryItem(item)) {
			item.onUse();
		}
	}

	$effect(() => {
		//$inspect(item?.name);
		$inspect("x " + currentSearchTerm);
	});
</script>

<div
	role="button"
	tabindex="0"
	class="inv text-center"
	class:active={(item?.name === selectedItem?.name || (item?.name.toLowerCase().includes(currentSearchTerm?.toLowerCase()) && currentSearchTerm.length > 0) ) && item != null }
	class:empty={!item}
	onclick={onSelect}
	oncontextmenu={onClick}
	onkeydown={() => {
		onSelect();
	}}
	aria-pressed={item === selectedItem}
>
	{#if item}
		{#if isInventoryItem(item) && item.amount > 1}
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

		&.empty {
			cursor: default;
		}

		&.active {
			outline: 2px solid red;
		}

		small {
			position: absolute;
			top: 2px;
			left: 50%;
			transform: translateX(-50%);
			font-size: 0.75rem;
			white-space: nowrap;
			z-index: 100;
			text-shadow: 1px 1px 2px black;
			pointer-events: none;
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

		img {
			&:hover {
				filter: brightness(0.8) sepia(1) hue-rotate(-50deg) saturate(2);
				cursor: pointer;
			}
		}
	}
</style>
