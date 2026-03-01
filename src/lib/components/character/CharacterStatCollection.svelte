<script lang="ts">
    import CharacterStat from "$lib/components/character/CharacterStat.svelte";
    import { PlayerController } from "$lib/controller/character.svelte";
</script>

<div class="row">
    <div class="col-auto border border-end-0 border-dark char-bg left">
        <CharacterStat name="Strength" value={PlayerController.stats.str}
        ></CharacterStat>
        <CharacterStat name="Int" value={PlayerController.stats.int}
        ></CharacterStat>
        <CharacterStat name="Vitality" value={PlayerController.stats.vit}
        ></CharacterStat>
        <CharacterStat name="Charisma" value={PlayerController.stats.char}
        ></CharacterStat>
        <CharacterStat name="Dexterity" value={PlayerController.stats.dex}
        ></CharacterStat>
    </div>
    <div class="col-auto border border-start-0 border-dark char-bg right">
        <p class="py-1">Race: {PlayerController.race}</p>
        <p class="py-1">Age: {PlayerController.age}</p>
        <p class="py-1">Gender: {PlayerController.gender}</p>
        <p class="py-1">Condition(s): {PlayerController.conditions.join(", ")}</p>
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
