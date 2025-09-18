<script lang="ts">
	import type { InventoryItem } from "$lib/types/item";
	import { isUsableItem } from "$lib/typeguards/item";
	import { PlayerController } from "$lib/controller/character.svelte";
	import StorageController from "$lib/controller/storage.svelte";

	let {
		inventory = $bindable(),
		selectedItem = $bindable(),
		item,
		currentSearchTerm,
		mode,
		cityDataId
	}: {
		inventory: InventoryItem[];
		selectedItem: InventoryItem | null;
		item: InventoryItem;
		currentSearchTerm: string;
		mode: "Normal" | "Bank";
		cityDataId: number
	} = $props();

	function onSelect() {
		if (selectedItem === item) {
			selectedItem = null;
			return;
		}
		selectedItem = item;
	}

	function onClick(e: MouseEvent) {
		e.preventDefault();
		if (mode === "Normal") {
			if (isUsableItem(item.item)) {
				console.log("Trying to activiate item: ", item.item.name, " amount: ", item.amount);
				const usedSuccessfully = item.item.onUse();

				// Ideally want to automate this later
				if (usedSuccessfully) {
					if (item.item.consumable) {
						item.amount -= 1;
						if (item.amount <= 0) {
							inventory = inventory.filter((i) => i.item.name !== item.item.name);
							if (selectedItem?.item.name === item.item.name) {
								selectedItem = null;
							}
						}
					}
				}
			}
		} else if (mode === "Bank") {
			if(cityDataId > 0) {
				PlayerController.removeItemByName(item.item.name);
				StorageController.addItem(item, cityDataId);
			} else {
				console.error("cityDataId is 0 or negative ", cityDataId);
			}
		} else {
			console.error("Invalid mode");
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
