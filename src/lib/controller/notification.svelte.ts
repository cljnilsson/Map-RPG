import NotificationStore from "#lib/stores/notification.svelte.js";
import LogController from "#lib/controller/logs.svelte.js";

class NotificationController {
	public newNotification(msg: string, type: "warning" | "error" | "info" = "info") {
		if (msg.length <= 0 || msg.length > 300) {
			console.warn("Notification message is empty or very long.", msg.length);
			return;
		}

		NotificationStore.queue = [
			...NotificationStore.queue,
			{
				message: msg,
				type: type,
			},
		];

		LogController.newLogSimple(`[Notification]: ${msg}.`, type);
	}
}

const instance = new NotificationController();

export default instance;