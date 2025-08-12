<script lang="ts">
	import type { Building } from "$lib/types/building";

	const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();

	let capacity = $state(20 * level);
	let taxIncome = $state(80);
	let quality: "Bad" | "Good" | "Excelent" = $state("Good");
	let resourceRequirement: "Low" | "Medium" | "High" = $state("Low");

	if (level >= 1 && level < 5) {
		quality = "Bad";
		resourceRequirement = "Low";
	} else if (level >= 5 && level < 10) {
		quality = "Good";
		resourceRequirement = "Medium";
	} else if (level >= 10) {
		quality = "Excelent";
		resourceRequirement = "High";
	}

	function goInside() {
		console.log("Going inside");
	}
</script>

<div class="row my-5">
	<div class="col border mx-2">
		<ul class="my-2">
			<li>Capacity: {capacity}</li>
			<li>
				Tax income: <span
					><img src="/items/coin3.jpg" width={16} height={16} class="me-1" alt="Golden coin with black background" /></span
				>{taxIncome}/h
			</li>
			<li>
				Food & Drink quality: <span
					class:text-success={quality === "Excelent"}
					class:text-warning={quality === "Good"}
					class:text-danger={quality === "Bad"}>{quality}</span
				>
			</li>
			<li>
				Buying resources from market: <span
					class:text-success={resourceRequirement === "High"}
					class:text-warning={resourceRequirement === "Medium"}
					class:text-danger={resourceRequirement === "Low"}>{resourceRequirement}</span
				>
			</li>
		</ul>
		<div class="text-end py-2">
			<button class="btn btn-primary" onclick={goInside}>Go Inside</button>
		</div>
	</div>
</div>
