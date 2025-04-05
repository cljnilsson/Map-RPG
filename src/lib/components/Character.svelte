<script lang="ts">
	import type { Character } from '$lib/types/character';
	import CharacterStat from './CharacterStat.svelte';

	let { character }: { character: Character } = $props();
</script>

<div class="row mt-5">
	<div class="col-4">
		<img src="/char.jpg" alt="Iron" class="img-fluid" />
	</div>
	<div class="col">
		<h3>{character.name}</h3>
		<div class="row">
			<div class="col-6">
				<CharacterStat name="Strength" value={character.stats.str}></CharacterStat>
				<CharacterStat name="Int" value={character.stats.int}></CharacterStat>
                <CharacterStat name="Vitality" value={character.stats.vit}></CharacterStat>
                <CharacterStat name="Charisma" value={character.stats.char}></CharacterStat>
                <CharacterStat name="Dexterity" value={character.stats.dex}></CharacterStat>
			</div>
			<div class="col">
				<p>Race: {character.race}</p>
				<p>Age: {character.age}</p>
				<p>Gender: {character.gender}</p>
				<p>Condition(s): {character.conditions.join(", ")}</p>
			</div>
		</div>
	</div>
</div>
