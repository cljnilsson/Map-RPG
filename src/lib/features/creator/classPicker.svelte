<script lang="ts">
 	import type { Class } from "$lib/types/class";
   	import CreatorClass from "$lib/features/creator/creatorClassIcon.svelte";
    import ClassStore from "$lib/stores/classes.svelte";

    let {selectedClass = $bindable()}: {selectedClass: Class | undefined} = $props();
</script>

<div class="row">
	<div class="col text-center">
		<div class="row justify-content-center">
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[0]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[1]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[2]} />
		</div>
		<div class="row justify-content-center">
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[3]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[4]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[5]} />
		</div>
		<div class="row justify-content-center">
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[6]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[7]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[8]} />
		</div>
		<div class="row justify-content-center">
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[9]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[10]} />
			<CreatorClass bind:selectedClass gameClass={ClassStore.classes[11]} />
		</div>
	</div>
</div>
<div class="row my-5">
	<div class="col">
		<h5>{selectedClass?.name}</h5>
		<p>{selectedClass?.description}</p>
	</div>
</div>
