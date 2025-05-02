const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
	resourcesVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, resourcesVisibility: true, unitVisibility: true });

export default Store;
