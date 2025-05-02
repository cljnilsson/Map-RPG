<script lang="ts">
    import CharacterAvatar from "$lib/components/character/CharacterAvatar.svelte";
</script>

<div class="position-fixed bottom-0 start-0 m-3">
	<div class="bg-light border rounded shadow py-2 row g-0">
		<div class="col px-2">
            <CharacterAvatar width={100} height={100} />
		</div>
		<div class="col px-2">
			<button class="btn btn-primary btn-sm d-block mb-2">Option 1</button>
			<button class="btn btn-secondary btn-sm d-block mb-2">Option 2</button>
			<button class="btn btn-danger btn-sm d-block">Option 3</button>
		</div>
	</div>
</div>