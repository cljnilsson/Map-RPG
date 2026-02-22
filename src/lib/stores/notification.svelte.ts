type Notification = {
	message: string;
	type: "info" | "error" | "warning";
};

const Store = $state<{
	queue: Notification[];
}>({ queue: [] });

export default Store;