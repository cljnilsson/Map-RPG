import type { BaseUnit } from "$lib/types/unit";

const unitRegistry = {
	"Soldier": (): BaseUnit => ({
		id: "Soldier",
		name: "Soldier",
		description: "",
		icon: "/units/soldier.jpg",
		cost: [],
		timeInSeconds: 40,
		unlockedBy: true
	}),
	"Priest": (): BaseUnit => ({
		id: "Priest",
		name: "Priest",
		description: "",
		icon: "/units/priest.jpg",
		cost: [],
		timeInSeconds: 40,
		unlockedBy: true
	}),
	"Merchant": (): BaseUnit => ({
		id: "Merchant",
		name: "Merchant",
		description: "",
		icon: "/units/merchant.jpg",
		cost: [],
		timeInSeconds: 40,
		unlockedBy: true
	}),
	"Smith": (): BaseUnit => ({
		id: "Smith",
		name: "Smith",
		description: "",
		icon: "/units/smith.jpg",
		cost: [],
		timeInSeconds: 40,
		unlockedBy: true
	})
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(unitRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Unit ID mismatch: key "${key}" does not match unit ID "${value().id}"`);
	}
}

export type UnitId = keyof typeof unitRegistry;

export function getUnit<T extends UnitId>(id: T) {
	return unitRegistry[id]();
}

export function safeGetUnit(id: string): BaseUnit | undefined {
	console.log(id);
	if (id in unitRegistry) {
		return unitRegistry[id as UnitId]();
	}
	return undefined;
}
