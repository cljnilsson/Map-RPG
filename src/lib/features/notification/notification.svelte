<script lang="ts">
	import LoggerStore from "$lib/stores/logs.svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
	import NotificationStore from "$lib/stores/notification.svelte";

	let showNotification = $state(false);

	const duration = 2000;
	const animationDuration = 350;

	let currentNotificationMessage = $derived(NotificationStore.queue[0]);

	$effect(() => {
		// Runs on state changes
		if(!showNotification && currentNotificationMessage) {
			doIt();
		}
	});

	function onNotificationEnd() {
		showNotification = false;

		if (NotificationStore.queue.length > 0) {
			NotificationStore.queue = [...NotificationStore.queue.slice(1)];
		}
	}

	function doIt() {
		if (currentNotificationMessage) {
			showNotification = true;
			LoggerStore.logs = [
				...LoggerStore.logs,
				{
					message: currentNotificationMessage.message,
					type: currentNotificationMessage.type,
					timestamp: new Date()
				}
			];
			setTimeout(onNotificationEnd, duration);
		}
	}

	onMount(() => {
		setTimeout(() => {
			NotificationStore.queue = [
				{ message: "GLOBAL notification here", type: "info" },
				{ message: "GLOBAL notification here 2", type: "info" },
				{ message: "GLOBAL notification here 3", type: "info" },
				{ message: "GLOBAL notification here 4", type: "info" }
			];
		}, 1000);
	});
</script>

{#if showNotification && currentNotificationMessage}
	<!--<h3 transition:fly={{ y: 200, duration: animationDuration }}>{currentNotificationMessage.message}</h3>-->
	<h3>{currentNotificationMessage.message}</h3>
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
