<script lang="ts">
	let { path, alt, onSelectCallback }: { path: string; alt: string; onSelectCallback?: (chosenClass: string) => void } = $props();
	let tempSelected: boolean = $state(false);

	function onClick() {
		if(onSelectCallback) {
			onSelectCallback("Temp text for now");
		}

		tempSelected = !tempSelected;
	}

	// Todo, select class  randomly
	// Show current class on main screen
	// Need shared selection data between creatorClassIcons
	// Show class description on select, probably need to declare a class type and classStore
</script>

<div class="col-3">
	<img class:selected={tempSelected} role="button" src={path} width="100px" height="100px" {alt} onclick={onClick} />
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