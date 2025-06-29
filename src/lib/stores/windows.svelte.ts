const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
	resourcesVisibility: boolean;
	eventsVisibility: boolean;
	questVisibility: boolean;
	inventoryVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, resourcesVisibility: true, unitVisibility: true, eventsVisibility: true, questVisibility: true, inventoryVisibility: true });

export default Store;
