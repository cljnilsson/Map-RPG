<script lang="ts">
	import CharacterStat from '$lib/components/character/CharacterStat.svelte';
	import CharacterStore from '$lib/stores/character.svelte';
	import CharacterAvatar from '$lib/components/character/CharacterAvatar.svelte';
</script>

<div class="row mt-5 justify-content-center">
	<div class="col-auto">
		<CharacterAvatar />
	</div>
	<div class="col-auto">
		<h3>{CharacterStore.character.name}</h3>
		<div class="row">
			<div class="col-auto border border-end-0 border-dark char-bg left">
				<CharacterStat name="Strength" value={CharacterStore.character.stats.str}></CharacterStat>
				<CharacterStat name="Int" value={CharacterStore.character.stats.int}></CharacterStat>
				<CharacterStat name="Vitality" value={CharacterStore.character.stats.vit}></CharacterStat>
				<CharacterStat name="Charisma" value={CharacterStore.character.stats.char}></CharacterStat>
				<CharacterStat name="Dexterity" value={CharacterStore.character.stats.dex}></CharacterStat>
			</div>
			<div class="col-auto border border-start-0 border-dark char-bg right">
				<p class="py-1">Race: {CharacterStore.character.race}</p>
				<p class="py-1">Age: {CharacterStore.character.age}</p>
				<p class="py-1">Gender: {CharacterStore.character.gender}</p>
				<p class="py-1">Condition(s): {CharacterStore.character.conditions.join(', ')}</p>
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
