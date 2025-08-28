import type { BaseUnit } from "$lib/types/unit";

const unitRegistry = {
	"black-market": (): BaseUnit => ({
		id: "black-market",
		name: "Black Market",
		description:
			"A dubious establishment that offers a rotating selection of goods from questionable sources for the right buyer. Don't ask questions.",
		icon: "/buildings/black-market.png",
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
