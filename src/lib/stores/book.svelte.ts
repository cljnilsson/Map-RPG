const Store = $state<{ currentBook: string[] | undefined; currentPage: number; visible: boolean }>({
	currentBook: undefined,
	currentPage: 1,
	visible: false,
});

export default Store;