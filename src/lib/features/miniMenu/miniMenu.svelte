<script lang="ts">
	import DialogueController from "$lib/controller/dialogue.svelte";
	import { Tween } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import CharacterAvatar from "$lib/components/character/CharacterAvatar.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import MapController from "$lib/controller/map.svelte";
	import CharacterStatCollection from "$lib/components/character/CharacterStatCollection.svelte";
	import { isCityMap } from "$lib/typeguards/map";
	
	const h = 140;
	const w = 120;

	let menuWidth = new Tween(w, { duration: 300, easing: cubicOut });
	let menuHeight = new Tween(h, { duration: 300, easing: cubicOut });
	let isMenuExpanded = $state(false);

	function toggleMenuSize() {
		isMenuExpanded = !isMenuExpanded;
		menuWidth.set(isMenuExpanded ? w * 4 : w);
		menuHeight.set(isMenuExpanded ? h * 4 : h);
	}

	function onAvatarClick() {
		console.log("Avatar clicked");
		toggleMenuSize();
	}
</script>

<div
	id="mini-menu"
	class="position-fixed bottom-0 start-0 m-3 rounded border shadow py-2 overflow-hidden"
	style="width: {menuWidth.current}px; height: {menuHeight.current}px; z-index: 1050;"
	class:d-none={DialogueController.inDialogue}
>
	<div class="row mb-3 g-0">
		<div class="col-auto px-2">
			<CharacterAvatar width={100} height={100} onClickCallback={onAvatarClick} />
		</div>
	</div>
	<div class="row border-top">
		<div class="col mx-3 my-3">
			<CharacterStatCollection />
		</div>
	</div>
	{#if isMenuExpanded}
		<div class="px-2 py-3 border-top">
			<a href="/settings"><button class="btn btn-primary my-1">Settings</button></a>
			<a href="/wiki"><button class="btn btn-primary my-1">Wiki</button></a>
		</div>
	{/if}
</div>

<style>
	#mini-menu {
		backdrop-filter: blur(20px);
		background-color: rgba(255, 255, 255, 0.5);
	}
	button {
		max-width: 100px;
		display: block;
	}
</style>
