import type { QueueItem } from "$lib/types/queueItem";
import LogController from "$lib/controller/logs.svelte";
import dayjs from "dayjs";

const store = $state({
	queue: [] as QueueItem[],
});

if (typeof window !== "undefined") {
	let timer: ReturnType<typeof setInterval> | null = null;

	// Use `queueEffect` instead of onMount/onDestroy for SSR-safe reactivity
	queueMicrotask(() => {
		timer = setInterval(() => {
			const now = dayjs();

			for (const q of store.queue) {
				if (dayjs(q.time.end).isBefore(now)) {
					q.onComplete();

					LogController.newLog(`Finished ${q.type ?? "task"}: ${q.name}`);

					store.queue = store.queue.filter((item) => item !== q);
				}
			}

			// Force reactivity
			if (store.queue.length > 0) {
				store.queue = [...store.queue];
			}
		}, 1000);
	});

	// Cleanup if the browser unloads
	window.addEventListener("beforeunload", () => {
		if (timer) clearInterval(timer);
	});
}

export default store;
