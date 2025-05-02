<script lang="ts">
	import { tweened, Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import CharacterAvatar from "$lib/components/character/CharacterAvatar.svelte";
	import WindowStore from '$lib/stores/windows.svelte';
	import MapStore from "$lib/stores/map.svelte";

	const h = 140;
	const w = 230;

	let menuWidth = new Tween(w, { duration: 300, easing: cubicOut });
	let menuHeight = new Tween(h, { duration: 300, easing: cubicOut });
	let isMenuExpanded = $state(false);

	function toggleMenuSize() {
		isMenuExpanded = !isMenuExpanded;
		menuWidth.set(isMenuExpanded ? w*4 : w);
		menuHeight.set(isMenuExpanded ? h*4 : h); // Adjust height values as needed
	}

	function onAvatarClick() {
		console.log("Avatar clicked");
		toggleMenuSize();
	}
</script>

<div 
	class="position-fixed bottom-0 start-0 m-3 bg-light border rounded shadow py-2 overflow-hidden"
	style="width: {menuWidth.current}px; height: {menuHeight.current}px; z-index: 1050;">
	<div class="row g-0">
		<div class="col-auto px-2">
			<CharacterAvatar width={100} height={100} onClickCallback={onAvatarClick} />
		</div>
		<div class="col px-2">
			{#if MapStore.currentMapState.map.type === "city"}
				<button class="btn btn-primary btn-sm d-block mb-2 w-100" on:click={() => WindowStore.unitVisibility = !WindowStore.unitVisibility}>Units</button>
			{/if}
			<button class="btn btn-secondary btn-sm d-block mb-2 w-100" on:click={() => WindowStore.navigationVisibility = !WindowStore.navigationVisibility}>Navigation</button>
			<button class="btn btn-danger btn-sm d-block w-100" on:click={() => WindowStore.loggerVisibility = !WindowStore.loggerVisibility}>Logs</button>
		</div>
	</div>
	{#if isMenuExpanded}
		<div class="p-2">
			<p>Additional content goes here...</p>
			<!-- Add more content or components as needed -->
		</div>
	{/if}
</div>
