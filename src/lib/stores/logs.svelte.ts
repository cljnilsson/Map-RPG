import type { Log } from "#lib/types/logs.js";

const Store = $state<{
	logs: Log[];
	currentPage: number;
}>({ logs: [], currentPage: 1 });

export default Store;