import LogStore from "$lib/stores/logs.svelte";
import { SvelteDate } from "svelte/reactivity";
import type { LogChunk } from "$lib/types/logs";

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

	private _newLog(msg: LogChunk[], color: string = "default", type: "warning" | "error" | "info") {
		LogStore.logs = [
			...LogStore.logs,
			{
				timestamp: new SvelteDate(),
				message: msg,
				type: type,
				color: color,
			},
		];

		console.log(`Frontned log [${type}]: `, msg);
	}

	private validateLogChunk(msg: number | string): boolean {
		if (typeof msg === "string") {
			if (msg.length === 0) {
				console.warn("Log message is empty.");
				return false;
			}

			if (msg.length > 300) {
				console.warn("Log message is too long.", msg.length);
				return false;
			}
		} else if (typeof msg === "number") {
			if (!Number.isFinite(msg)) {
				console.warn("Log number is not finite.", msg);
				return false;
			}
		}

		return true;
	}

	public newLogSimple(msg: string | number, type: "warning" | "error" | "info" = "info") {
		const color: string = typeof msg === "string" ? "default" : LogController.numberColor;

		this._newLog([{ color, text: msg }], color, type);
	}

	public newLog(msg: Array<{ text: string | number }>, color: string, type: "warning" | "error" | "info" = "info") {
		let newArr: Array<{ text: string | number; color: string }> = [];

		for (const chunk of msg) {
			if (!this.validateLogChunk(chunk.text)) {
				return; // unsure if it breaks the function or just the loop, check later
			}
			newArr = [
				...newArr,
				{ text: chunk.text, color: typeof chunk.text === "string" ? "default" : LogController.numberColor },
			];
		}

		this._newLog(newArr, color, type);
	}

	public newLogC(msg: LogChunk[], color: string, type: "warning" | "error" | "info" = "info") {
		for (const chunk of msg) {
			if (!this.validateLogChunk(chunk.text)) {
				return; // unsure if it breaks the function or just the loop, check later
			}
		}

		this._newLog(msg, color, type);
	}
}

const instance = new LogController();

export default instance;