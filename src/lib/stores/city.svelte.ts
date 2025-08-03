const Store = $state<{
	population: number;
	workers: number;
	units: { soldiers: number; merchants: number; smiths: number; priests: number };
	resources: { name: string; amount: number; iconPath: string }[];
}>({
	population: 300,
	workers: 6,
	units: {
		soldiers: 4,
		merchants: 1,
		smiths: 1,
		priests: 0
	},
	resources: [
		{ name: "Gold", amount: 100, iconPath: "/items/coin3.jpg" },
		{ name: "Wood", amount: 50, iconPath: "/items/wood.jpg" },
		{ name: "Stone", amount: 30, iconPath: "/items/stone0.jpg" },
		{ name: "Silk", amount: 30, iconPath: "/items/silk.png" },
		{ name: "Wheat", amount: 30, iconPath: "/items/wheat.jpg" },
		{ name: "Iron", amount: 30, iconPath: "/items/ore1.png" }
	]
});

export default Store;
