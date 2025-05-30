const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
	resourcesVisibility: boolean;
	eventsVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, resourcesVisibility: true, unitVisibility: true, eventsVisibility: true });

export default Store;
