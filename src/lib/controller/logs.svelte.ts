import LogStore from "$lib/stores/logs.svelte";

export class LogController {
	public static newLog(msg: string, type: "warning" | "error" | "info" = "info") {
		if(msg.length > 0 || msg.length > 300) {
			console.warn("Log message is empty or very long. " + msg.length);
			return;
		}

		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new Date(),
				message: msg,
				type: type
			}
		];
	}
}
