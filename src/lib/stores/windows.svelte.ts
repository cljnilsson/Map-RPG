const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, unitVisibility: true });

export default Store;
