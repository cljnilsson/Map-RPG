import LogStore from "$lib/stores/logs.svelte";
import { SvelteDate } from "svelte/reactivity";

class LogController {
	private static numberColor: string = "teal";

	get currentPage() {
		return LogStore.currentPage;
	}

	set currentPage(v: number) {
		if (v < 0) {
			console.warn("Page set to negative, probably an error!");
		}

		LogStore.currentPage = v;
	}

	get logs() {
		return LogStore.logs;
	}

	private _newLog(msg: string | number, type: "warning" | "error" | "info") {
		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new SvelteDate(),
				message: msg,
				type: type,
				color: typeof msg === "string" ? "default" : LogController.numberColor,
			},
		];

		console.log(`Frontned log [${type}]: `, msg);
	}

	public newLog(msg: string | number, type: "warning" | "error" | "info" = "info") {
		if (typeof msg === "string") {
			if (msg.length === 0) {
				console.warn("Log message is empty.");
				return;
			}

			if (msg.length > 300) {
				console.warn("Log message is too long.", msg.length);
				return;
			}
		} else if (typeof msg === "number") {
			if (!Number.isFinite(msg)) {
				console.warn("Log number is not finite.", msg);
				return;
			}
		}

		this._newLog(msg, type);
	}
}

const instance = new LogController();

export default instance;