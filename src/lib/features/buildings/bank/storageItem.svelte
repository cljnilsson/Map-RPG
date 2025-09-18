<script lang="ts">
	import type { InventoryItem } from "$lib/types/item";
	import { isUsableItem } from "$lib/typeguards/item";
	import { PlayerController } from "$lib/controller/character.svelte";
	import StorageController from "$lib/controller/storage.svelte";

	let {
		inventory = $bindable(),
		item,
		currentSearchTerm,
		cityDataId
	}: {
		inventory: InventoryItem[];
		item: InventoryItem;
		currentSearchTerm: string;
		cityDataId: number;
	} = $props();

	let selectedItem: InventoryItem | null = $state(null);

	function onSelect() {
		if (selectedItem === item) {
			selectedItem = null;
			return;
		}
		selectedItem = item;
	}

	async function onClick(e: MouseEvent) {
		e.preventDefault();

		if (cityDataId > 0) {
			// Order matters, modifying the inventory shuffles everything so the reference gets jumbled, need a better each index or save/lock the reference or swap the order
			let success = await StorageController.removeItemByName(item.item.name, cityDataId);
			console.log("removed item from storage:", success);
			if(success) {
				PlayerController.giveItem(item.item, item.amount);
			}
		} else {
			console.error("cityDataId is 0 or negative ", cityDataId);
		}
	}

	$effect(() => {
		//$inspect("x " + currentSearchTerm);
	});
</script>

<div
	role="button"
	tabindex="0"
	class="inv text-center"
	class:active={(item?.item.name === selectedItem?.item.name ||
		(item?.item.name.toLowerCase().includes(currentSearchTerm?.toLowerCase()) && currentSearchTerm.length > 0)) &&
		item != null}
	class:empty={!item}
	onclick={onSelect}
	oncontextmenu={onClick}
	onkeydown={() => {
		onSelect();
	}}
	aria-pressed={item === selectedItem}
>
	{#if item}
		{#if item.amount > 1}
			<small>{item.amount}</small>
		{/if}
		{#if item.item.iconPath}
			<div class="icon-wrapper">
				<img src={item.item.iconPath} alt={item.item.name} width="64" height="64" />
				<img src="/highlight.png" alt="A gentle glow to indicate the quality of the hovered item based on color" class="glow" />
			</div>
		{:else}
			<i class={item.item.iconClass}></i>
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

		.icon-wrapper {
			position: relative;
			width: 64px;
			height: 64px;

			img {
				position: absolute;
				top: 0;
				left: 0;
				width: 64px;
				height: 64px;
				display: block;

				&.glow {
					opacity: 0;
					transition: opacity 0.1s ease;
					pointer-events: none; // prevent glow from blocking hover
				}
			}

			&:hover {
				.glow {
					opacity: 1;
				}
			}
		}
	}
</style>
