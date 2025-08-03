<script lang="ts">
	import dayjs from "dayjs";
	import QueueStore from "$lib/stores/queueStore.svelte";

	let { available = $bindable(), unit = $bindable(), name, iconPath }: { unit: number; available: number; name: string, iconPath: string } = $props();
	const min = 0;

	function onAdd() {
		available -= 1;
		QueueStore.queue = [
			...QueueStore.queue,
			{
				name: "",
				type: "unit",
				time: { start: dayjs().toDate(), end: dayjs().add(90, "seconds").toDate() },
				onComplete: () => {
					unit += 1;
				}
			}
		];
	}

	function onRemove() {
		unit -= 1;
		QueueStore.queue = [
			...QueueStore.queue,
			{
				name: "",
				type: "unit",
				time: { start: dayjs().toDate(), end: dayjs().add(90, "seconds").toDate() },
				onComplete: () => {
					available += 1;
				}
			}
		];
	}
</script>

<div class="row my-2 justify-content-center align-items-center">
	<div class="col-auto">
		<img src={iconPath} alt={name} class="img-fluid" style="max-width: 40px; max-height: 40px;">
	</div>
	<div class="col-xl-3 col-md-6">
		{name}
	</div>
	<div class="col-xl-1 col-md-2">
		{unit}
	</div>
	<div class="col-xl-4 col-md-5 text-center">
		<button class="btn btn-outline-light" onclick={onAdd} disabled={available <= 0}>+</button>
		<button class="btn btn-outline-light" onclick={onRemove} disabled={unit <= min}>-</button>
	</div>
</div>
