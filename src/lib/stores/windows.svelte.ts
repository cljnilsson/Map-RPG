const Store = $state<{
	loggerVisibility: boolean;
	navigationVisibility: boolean;
	unitVisibility: boolean;
	resourcesVisibility: boolean;
	eventsVisibility: boolean;
	questVisibility: boolean;
	inventoryVisibility: boolean;
	vendorVisibility: boolean;
}>({ loggerVisibility: false, navigationVisibility: true, resourcesVisibility: true, unitVisibility: true, eventsVisibility: true, questVisibility: true, inventoryVisibility: false, vendorVisibility: false });

export default Store;
