import type { Building } from "$lib/types/building";
import {getResource} from "$lib/data/resources";
import BlackMarket from "$lib/features/buildings/black-market/black-market.svelte";
import Market from "$lib/features/buildings/market/market.svelte";
import AdventureGuild from "$lib/features/buildings/adventure-guild/adventure-guild.svelte";
import BeastPen from "$lib/features/buildings/beast-pen/beast-pen.svelte";
import Inn from "$lib/features/buildings/inn/inn.svelte";

const buildingRegistry = {
	"black-market": (): Building => ({
		id: "black-market",
		name: "Black Market",
		description: "A dubious establishment that offers a rotating selection of goods from questionable sources for the right buyer. Don't ask questions.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: BlackMarket
	}),
	"library": (): Building => ({
		id: "library",
		name: "Library",
		description: "With both a private and public section the library houses helpful information in its tomes while also storing your personal collection.",
		requirements: true,
		artPath: "/buildings/library.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: undefined
	}),
	"inn": (): Building => ({
		id: "inn",
		name: "Inn",
		description: "Not only good for morale, but also makes it easy to find people as the community gathers in the evening.",
		requirements: true,
		artPath: "/buildings/inn.png",
		cost: [
			{...getResource("Gold"), amount: 100},
			{...getResource("Wood"), amount: 50},
			{...getResource("Stone"), amount: 30},
			{...getResource("Silk"), amount: 30},
			{...getResource("Wheat"), amount: 30},
			{...getResource("Iron"), amount: 30},
		],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: Inn
	}),
	"shrine": (): Building => ({
		id: "shrine",
		name: "Shrine",
		description: "A simple center of the faith, enables the recruitment of priests.",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "sacred",
		componentOnClick: undefined
	}),
	"watch-tower": (): Building => ({
		id: "watch-tower",
		name: "Watchtower",
		description: "TBD",
		requirements: true,
		artPath: "/buildings/watchtower.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: undefined
	}),
	"barracks": (): Building => ({
		id: "barracks",
		name: "Barracks",
		description: "Houses your soldiers, your max capacity gets increased.",
		requirements: true,
		artPath: "/buildings/barracks.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: undefined
	}),
	"adventurer's-guild": (): Building => ({
		id: "adventurer's-guild",
		name: "Adventurer's Guild",
		description: "Offers rewarding contracts for various dangerous tasks.",
		requirements: true,
		artPath: "/buildings/adventure-guild.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: AdventureGuild
	}),
	"hunter-lodge": (): Building => ({
		id: "hunter-lodge",
		name: "Hunters' Lodge",
		description: "Allows rangers to put their bows to use in peacetime, allows recruitment of rangers.",
		requirements: true,
		artPath: "/buildings/hunter-lodge.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: undefined
	}),
	"market": (): Building => ({
		id: "market",
		name: "Market",
		description: "At the market you can trade resources, someone's trash is another's treasure.",
		requirements: true,
		artPath: "/buildings/market.png",
		cost: [],
		timeInSeconds: 40,
		plotType: "default",
		componentOnClick: Market
	}),
	"tourney-grounds": (): Building => ({
		id: "tourney-grounds",
		name: "Tourney Grounds",
		description: "A great source of entertainment and a boon to the economy. Skilled soldiers can be turned into knights when a tournament is held.",
		requirements: true,
		artPath: "/buildings/tourney-grounds.png",
		cost: [],
		timeInSeconds: 180,
		plotType: "default",
		componentOnClick: undefined
	}),
	"beast-pen": (): Building => ({
		id: "beast-pen",
		name: "Beast Pen",
		description: "You choose to not limit yourself to humans, beasts can be trained to fulfil various useful tasks.",
		requirements: true,
		artPath: "/buildings/beast-pen.png",
		cost: [],
		timeInSeconds: 150,
		plotType: "default",
		componentOnClick: BeastPen
	}),
	"bank": (): Building => ({
		id: "bank",
		name: "Bank",
		description: "A rich third party institute allows you to borrow large batches of resources in exchange for paying them back with interest.",
		requirements: true,
		artPath: "/buildings/bank.png",
		cost: [],
		timeInSeconds: 150,
		plotType: "default",
		componentOnClick: undefined
	}),
	"slave-market": (): Building => ({
		id: "slave-market",
		name: "Slave Market",
		description: "Allows the 'recruitment' of slaves, cheaper than workers but with a higher fatality rate and a moral price",
		requirements: true,
		artPath: "/buildings/black-market.png",
		cost: [],
		timeInSeconds: 150,
		plotType: "default",
		componentOnClick: undefined
	}),
	"storage": (): Building => ({
		id: "storage",
		name: "Storage",
		description: "Resources are useless without a safe location to store them, this building increases your max capacity for all resources.",
		requirements: true,
		artPath: "/buildings/storage.png",
		cost: [
			{...getResource("Gold"), amount: 50},
			{...getResource("Wood"), amount: 30},
			{...getResource("Stone"), amount: 20},
			{...getResource("Silk"), amount: 0},
			{...getResource("Wheat"), amount: 10},
			{...getResource("Iron"), amount: 10},
		],
		timeInSeconds: 70,
		plotType: "default",
		componentOnClick: undefined
	}),
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(buildingRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Building ID mismatch: key "${key}" does not match building ID "${value().id}"`);
	}
}

export type BuildingId = keyof typeof buildingRegistry;

export function getBuilding<T extends BuildingId>(id: T) {
	return buildingRegistry[id]();
}

export function getBuildingsByPlotType(plotType: "default" | "sacred" | "pristine") : Building[] {
	const found: Building[] = [];

	for (const building of Object.values(buildingRegistry)) {
		const b = building();
		if (b.plotType === plotType) {
			found.push(b);
		}
	}

	return found;
}

export function safeGetBuilding(id: string): Building | undefined {
	console.log(id);
	if (id in buildingRegistry) {
		return buildingRegistry[id as BuildingId]();
	}
	return undefined;
}