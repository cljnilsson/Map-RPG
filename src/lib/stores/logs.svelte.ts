type Log = {
	timestamp: Date;
	message: string | number;
	color?: string;
	type: "info" | "error" | "warning";
};

const Store = $state<{
	logs: Log[];
	currentPage: number;
}>({ logs: [], currentPage: 1 });

export default Store;