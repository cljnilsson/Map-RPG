<script lang="ts">
	import LoggerStore from "$lib/stores/logs.svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
	import NotificationStore from "$lib/stores/notification.svelte";

	let showNotification = $state(false);

	const duration = 5000;
	const animationDuration = 350;

	function onNotificationEnd() {
		if (NotificationStore.queue.length > 0) {
			NotificationStore.currentNotificationMessage = NotificationStore.queue.shift() || undefined;
			if (NotificationStore.currentNotificationMessage) {
				showNotification = false;
				setTimeout(() => {
					doIt();
				}, animationDuration);
			}
		} else {
			//currentNotificationMessage = ""; don't reset because it would screw with the animation?
			showNotification = false;
		}
	}

	function doIt() {
		if (NotificationStore.currentNotificationMessage) {
			showNotification = true;
			LoggerStore.logs = [
				...LoggerStore.logs,
				{
					message: NotificationStore.currentNotificationMessage.message,
					type: NotificationStore.currentNotificationMessage.type,
					timestamp: new Date()
				}
			];
			setTimeout(onNotificationEnd, duration); // Hide after 5 seconds
		}
	}

	onMount(() => {
		setTimeout(() => {
			NotificationStore.currentNotificationMessage = { message: "GLOBAL notification here", type: "info" };
			NotificationStore.queue = [
				{ message: "GLOBAL notification here 2", type: "info" },
				{ message: "GLOBAL notification here 3", type: "info" },
				{ message: "GLOBAL notification here 4", type: "info" }
			];
			doIt();
		}, 3000);
	});
</script>

{#if showNotification && NotificationStore.currentNotificationMessage}
	<h3 transition:fly={{ y: 200, duration: animationDuration }}>{NotificationStore.currentNotificationMessage.message}</h3>
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
