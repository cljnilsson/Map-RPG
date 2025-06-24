const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
	resourcesVisibility: boolean;
	eventsVisibility: boolean;
	questVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, resourcesVisibility: true, unitVisibility: true, eventsVisibility: true, questVisibility: true });

export default Store;
