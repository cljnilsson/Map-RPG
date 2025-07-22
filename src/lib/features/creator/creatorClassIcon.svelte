<script lang="ts">
	import type {Class} from "$lib/types/class";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

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
	<ClickableElement onClickCallback={onClick}>
		<img class:selected={gameClass.name === selectedClass?.name} src={gameClass.icon} alt={"iron representing the " + gameClass.name + " class"} width="100px" height="100px" />
	</ClickableElement>
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