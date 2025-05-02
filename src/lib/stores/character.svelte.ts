import type {Character} from '$lib/types/character';
const Store = $state<{
    character: Character,
    location: string,
}>({character: {stats: {str: 5, int: 8, vit: 10, char: 7, dex: 5}, name:"Alice", health: 25, maxHealth: 100, age: 22, gender: "Female", race: "Human", conditions: []}, location: "Forest"});

export default Store;