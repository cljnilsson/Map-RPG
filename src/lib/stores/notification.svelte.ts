type Notification = {
	message: string;
	type: "info" | "error" | "warning";
};

const Store = $state<{
	queue: Notification[];
	currentNotificationMessage: Notification | undefined;
}>({ queue: [], currentNotificationMessage: undefined });

export default Store;
