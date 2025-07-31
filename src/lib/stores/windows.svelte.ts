type WindowData = {
	visible: boolean;
	x: number;
	y: number;
};

const Store = $state<{
	logger: WindowData;
	navigation: WindowData;
	unit: WindowData;
	resources: WindowData;
	events: WindowData;
	quest: WindowData;
	inventory: WindowData;
	vendor: WindowData;
}>({
	logger: {
		visible: false,
		x: 50,
		y: 900
	},
	navigation: {
		visible: true,
		x: 1000,
		y: 1250
	},
	resources: {
		visible: true,
		x: 1300,
		y: 1250
	},
	unit: {
		visible: true,
		x: 600,
		y: 950
	},
	events: {
		visible: true,
		x: 1600,
		y: 1250
	},
	quest: {
		visible: true,
		x: 1300,
		y: 450
	},
	inventory: {
		visible: false,
		x: 300,
		y: 450
	},
	vendor: {
		visible: false,
		x: 300,
		y: 450
	}
});

export default Store;
