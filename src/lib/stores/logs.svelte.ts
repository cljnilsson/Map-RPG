type Logs = {
    timestamp: Date,
    message: string
}

const Store = $state<{
    logs: Logs[],
    currentPage: number,
}>({logs: [], currentPage: 1});

export default Store;