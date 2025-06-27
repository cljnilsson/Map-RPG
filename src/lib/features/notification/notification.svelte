<script>
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";

	let showNotification = $state(false);

	onMount(() => {
		setTimeout(() => {
			showNotification = true;
			setTimeout(() => {
				showNotification = false;
			}, 5000); // Hide after 5 seconds
		}, 3000);
	});
</script>

{#if showNotification}
	<h3 transition:fly={{ y: 200, duration: 350 }}>GLOBAL notification here</h3>
{/if}

<style>
	h3 {
		position: absolute;
		width: 100%;
		text-align: center;
		top: 15%;
		z-index: 100000;
		color: white;
		text-shadow: 0 0 5px black;
		padding: 10px;
	}
</style>
