<script lang="ts">
   	import CreatorFaith from "$lib/features/creator/creatorFaithIcon.svelte";
    import type { Faith } from "$lib/types/faith";
   	import FaithStore from "$lib/stores/faith.svelte";

    let {selectedFaith = $bindable()}: {selectedFaith: Faith | undefined} = $props();
</script>

<div class="row">
	<div class="col text-center">
		<div class="row justify-content-center">
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[0]} />
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[1]} />
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[2]} />
		</div>
		<div class="row py-2 justify-content-center">
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[3]} />
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[4]} />
			<CreatorFaith bind:selectedFaith faith={FaithStore.faith[5]} />
		</div>
	</div>
</div>
<div class="row my-5">
	<div class="col">
		<h5>{selectedFaith?.name}</h5>
		<p>{selectedFaith?.description}</p>
	</div>
</div>
