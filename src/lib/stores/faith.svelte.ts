import type { Faith } from "$lib/types/faith";

const Store = $state<{ faith: Faith[] }>({
	faith: [
		{
			name: "1",
			description: "Using brute force the Barbarian somehow manage to have their way.",
			icon: "/faith/1.png"
		},
		{
			name: "2",
			description: "Using finesse and experience, the Fighter dominates in melee combat.",
			icon: "/faith/2.png"
		},
		{
			name: "3",
			description:
				"Choosing an upfront fight is not a requirement for victory, the Rogue will use cunning and deception for their goals.",
			icon: "/faith/3.png"
		},
		{
			name: "4",
			description: "A friend of the wilds while embodying nature's wrath.",
			icon: "/faith/4.png"
		},
		{
			name: "5",
			description: "The Bard is not for the lone wolf, they find allies easily and empower them.",
			icon: "/faith/5.png"
		},
		{
			name: "6",
			description: "Preferring deadly precision from a distance, the Ranger is both silent and lethal.",
			icon: "/faith/6.png"
		}
	]
});

export default Store;
