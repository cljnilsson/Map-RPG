import type { Log } from "$lib/types/logs";

const Store = $state<{
	logs: Log[];
	currentPage: number;
}>({ logs: [], currentPage: 1 });

export default Store;