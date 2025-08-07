import type { BaseResource } from "$lib/types/resource";

const resourceRegistry = {
	"Gold": (): BaseResource => ({
		name: "Gold", iconPath: "/items/coin3.jpg" 
	}),
	"Stone": (): BaseResource => ({
		name: "Stone", iconPath: "/items/stone0.jpg" 
	}),
	"Silk": (): BaseResource => ({
		name: "Silk", iconPath: "/items/silk.png" 
	}),
	"Wheat": (): BaseResource => ({
		name: "Wheat", iconPath: "/items/wheat.jpg" 
	}),
	"Iron": (): BaseResource => ({
		name: "Iron", iconPath: "/items/ore1.png" 
	}),
	"Wood": (): BaseResource => ({
		name: "Wood", iconPath: "/items/wood.jpg" 
	}),
} as const;

for (const [key, value] of Object.entries(resourceRegistry)) {
	if (key === value().name) {
		continue;
	} else {
		throw new Error(`BaseResource name mismatch: key "${key}" does not match BaseResource name "${value().name}"`);
	}
}

export type ResourceId = keyof typeof resourceRegistry;

export function getResource<T extends ResourceId>(id: T): BaseResource {
	return resourceRegistry[id]();
}

export function safeGetResource(name: string): BaseResource | undefined {
	if (name in resourceRegistry) {
		return resourceRegistry[name as ResourceId]();
	}
	return undefined;
}