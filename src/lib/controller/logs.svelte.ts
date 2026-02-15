import LogStore from "$lib/stores/logs.svelte";
import { SvelteDate } from "svelte/reactivity";

class LogController {
	public newLog(msg: string, type: "warning" | "error" | "info" = "info") {
		if (msg.length <= 0 || msg.length > 300) {
			console.warn("Log message is empty or very long. " + msg.length);
			return;
		}

		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new SvelteDate(),
				message: msg,
				type: type,
			},
		];

		console.log(`Frontned log [${type}]: `, msg);
	}
}

const instance = new LogController();

export default instance;
