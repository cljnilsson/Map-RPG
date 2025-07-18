import type { Class } from "$lib/types/class";

const Store = $state<{ classes: Class[] }>({
	classes: [
		{
			abilities: [],
			suggestedStats: ["Strength", "Vitality"],
			name: "Barbarian",
			description: "Using brute force the Barbarian somehow manage to have their way.",
			icon: "/classes/barbarian.png"
		},
		{
			abilities: [],
			suggestedStats: ["Strength", "Dexterity"],
			name: "Fighter",
			description: "Using finesse and experience, the Fighter dominates in melee combat.",
			icon: "/classes/fighter.png"
		},
		{
			abilities: [],
			suggestedStats: ["Dexterity", "Charisma"],
			name: "Rogue",
			description: "Choosing an upfront fight is not a requirement for victory, the Rogue will use cunning and deception for their goals.",
			icon: "/classes/rogue.png"
		},
		{
			abilities: [],
			suggestedStats: ["Intelligence", "Strength", "Dexterity"],
			name: "Druid",
			description: "A friend of the wilds while embodying nature's wrath.",
			icon: "/classes/druid.png"
		},
		{
			abilities: [],
			suggestedStats: ["Charisma", "Intelligence"],
			name: "Bard",
			description: "The Bard is not for the lone wolf, they find allies easily and empower them.",
			icon: "/classes/bard.png"
		},
		{
			abilities: [],
			suggestedStats: ["Dexterity"],
			name: "Ranger",
			description: "Preferring deadly precision from a distance, the Ranger is both silent and lethal.",
			icon: "/classes/ranger.png"
		},
		{
			abilities: [],
			suggestedStats: ["Dexterity", "Strength", "Vitality"],
			name: "Monk",
			description: "The monk mixes mystical arts and barehanded combat.",
			icon: "/classes/monk.png"
		},
		{
			abilities: [],
			suggestedStats: ["Strength", "Vitality", "Intelligence"],
			name: "Paladin",
			description: "Enforcing their faith's virtures through force.",
			icon: "/classes/paladin.png"
		},
		{
			abilities: [],
			suggestedStats: ["Intelligence"],
			name: "Cleric",
			description: "A scholar of the divine, the Cleric blesses allies and condems foes alike.",
			icon: "/classes/cleric.png"
		},
		{
			abilities: [],
			suggestedStats: ["Intelligence", "Charisma"],
			name: "Warlock",
			description: "No magic is too dark to use for the Warlock.",
			icon: "/classes/warlock.png"
		},
		{
			abilities: [],
			suggestedStats: ["Intelligence"],
			name: "Wizard",
			description: "Their ways and magic are largely unknown but it is common knowledge that bloodlines fill an imporant role in a Wizard's abilities.",
			icon: "/classes/wizard.png"
		},
		{
			abilities: [],
			suggestedStats: ["Intelligence"],
			name: "Sorcerer",
			description: "A sorcerer follows a methodic way to channel their magic.",
			icon: "/classes/sorc.png"
		}
	]
});

export default Store;
