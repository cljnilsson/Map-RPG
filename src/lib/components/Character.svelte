<script lang="ts">
	import type { Character } from '$lib/types/character';
	import CharacterStat from './CharacterStat.svelte';

	let { character }: { character: Character } = $props();
</script>

<div class="row mt-5 justify-content-center">
	<div class="col-auto">
		<img src="/char.jpg" alt="Your character" loading="lazy" />
		<div
			class="progress mt-2"
			role="progressbar"
			aria-label="Success example"
			aria-valuenow="25"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<div class="progress-bar bg-success" style="width: 25%">{character.health} / {character.maxHealth}</div>
		</div>
	</div>
	<div class="col-auto">
		<h3>{character.name}</h3>
		<div class="row">
			<div class="col-auto border border-end-0 border-dark char-bg left">
				<CharacterStat name="Strength" value={character.stats.str}></CharacterStat>
				<CharacterStat name="Int" value={character.stats.int}></CharacterStat>
				<CharacterStat name="Vitality" value={character.stats.vit}></CharacterStat>
				<CharacterStat name="Charisma" value={character.stats.char}></CharacterStat>
				<CharacterStat name="Dexterity" value={character.stats.dex}></CharacterStat>
			</div>
			<div class="col-auto border border-start-0 border-dark char-bg right">
				<p class="py-1">Race: {character.race}</p>
				<p class="py-1">Age: {character.age}</p>
				<p class="py-1">Gender: {character.gender}</p>
				<p class="py-1">Condition(s): {character.conditions.join(', ')}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.char-bg {
		background: rgba(235, 235, 235, 0.6);
		padding: 0.75rem;
		&.left {
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}
		&.right {
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
		}
		p {
			margin-bottom: 0;
		}
	}
</style>
