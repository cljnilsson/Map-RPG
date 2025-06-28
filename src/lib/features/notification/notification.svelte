<script lang="ts">
	import { fly } from "svelte/transition";
	import { elasticInOut } from "svelte/easing";
	import { onMount } from "svelte";

	let showNotification = $state(false);
	let currentNotificationMessage: string = $state("");
	let queue: string[] = $state([]);

	const duration = 5000;

	function onNotificationEnd() {
		if (queue.length > 0) {
			currentNotificationMessage = queue.shift() || "";
			if(currentNotificationMessage.length > 0) {
				doIt();
			}
		} else {
			//currentNotificationMessage = ""; don't reset because it would screw with the animation?
			showNotification = false;
		}
	}

	function doIt() {
		showNotification = true;
		setTimeout(onNotificationEnd, duration); // Hide after 5 seconds
	}

	onMount(() => {
		setTimeout(() => {
			currentNotificationMessage = "GLOBAL notification here";
			doIt();
		}, 3000);
	});
</script>

{#if showNotification}
	<h3 transition:fly={{ y: 200, duration: 350 }}>{currentNotificationMessage}</h3>
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
