<script lang="ts">
	import type {Class} from "$lib/types/class";

	let { gameClass, selectedClass = $bindable()}: { gameClass: Class; selectedClass: Class | undefined } = $props();

	function onClick() {
		if(selectedClass?.name === gameClass.name) {
			selectedClass = undefined;
		} else {
			selectedClass = gameClass;
		}
	}

	// Todo, select class  randomly
	// Show current class on main screen
	// Need shared selection data between creatorClassIcons
	// Show class description on select, probably need to declare a class type and classStore
</script>

<div class="col-3">
	<img class:selected={gameClass.name === selectedClass?.name} role="button" src={gameClass.icon} alt={"iron representing the " + gameClass.name + " class"} width="100px" height="100px" onclick={onClick} />
</div>

<style>
	img {
		transition: transform 0.3s ease;
		transform: scale(1);
		filter: grayscale(50%);
	}

	.selected {
		transform: scale(1.2);
		filter: grayscale(0%);
	}
</style>