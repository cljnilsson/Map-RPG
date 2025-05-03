type Logs = {
	timestamp: Date;
	message: string;
	type: "info" | "error" | "warning";
};

const Store = $state<{
	logs: Logs[];
	currentPage: number;
}>({ logs: [], currentPage: 1 });

export default Store;
