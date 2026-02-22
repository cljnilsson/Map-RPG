import NotificationStore from "$lib/stores/notification.svelte";
import LogController from "$lib/controller/logs.svelte";

export class NotificationController {
	public static newNotification(msg: string, type: "warning" | "error" | "info" = "info") {
		if (msg.length <= 0 || msg.length > 300) {
			console.warn("Notification message is empty or very long. " + msg.length);
			return;
		}

		NotificationStore.queue = [
			...NotificationStore.queue,
			{
				message: msg,
				type: type,
			},
		];

		LogController.newLog(`[Notification]: ${msg}.`, type);
	}
}