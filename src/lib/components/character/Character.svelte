<script lang="ts">
    import { PlayerController} from "$lib/controller/character.svelte";
	import CharacterAvatar from "$lib/components/character/CharacterAvatar.svelte";
	import CharacterStatCollection from "$lib/components/character/CharacterStatCollection.svelte";
</script>

<div class="row mt-5 justify-content-center">
	<div class="col-auto">
		<CharacterAvatar height={200} width={200} />
	</div>
	<div class="col-auto">
		<h3>{PlayerController.name}</h3>
		<CharacterStatCollection />
	</div>
</div>
