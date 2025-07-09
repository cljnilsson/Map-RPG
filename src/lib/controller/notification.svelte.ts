//import type { Character } from "$lib/types/character";
import NotificationStore from "$lib/stores/notification.svelte";
import LogStore from "$lib/stores/logs.svelte";

export class NotificationController {
	public static newNotification(msg: string, type: "info" | "error" | "info" = "info") {
		if(msg.length > 0 || msg.length > 300) {
			console.warn("Notification message is empty or very long. " + msg.length);
			return;
		}
		NotificationStore.queue = [
			...NotificationStore.queue,
			{
				message: msg,
				type: type
			}
		]
		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new Date(),
				message: `[Notification]: ${msg}.`,
				type: "info"
			}
		];
	}
}
