<script lang="ts">
	import {CityController} from "$lib/controller/city.svelte";
	import Window from "$lib/features/window/window.svelte";
	import UnitDesignator from "$lib/components/windows/unit/unitDesignator.svelte";
	import dayjs from "dayjs";
	import WindowStore from "$lib/stores/windows.svelte";
	import queue from "$lib/stores/queueStore.svelte";

	queue.queue = [...queue.queue, {
		name: "Worker => soldier",
		type: "unit",
		time: { start: new Date(), end: dayjs().add(15, "seconds").toDate() },
		onComplete: () => {
			CityController.units.soldiers += 1;
		}}
	];

	function secondsToHMS(totalSeconds: number): { h: number; m: number; s: number } {
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		return { h, m, s };
	}

	function timeLeft(end: Date): string {
		const seconds = dayjs(end).diff(dayjs(), "second");
		const { h, m, s } = secondsToHMS(seconds);

		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
			.toString()
			.padStart(2, "0")}`;
	}

	/*onDestroy(() => {
		clearInterval(timer);
	});*/
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	uniqueKey="UnitManagement"
	height={500}
	width={400}
	x={WindowStore.unit.x}
	y={WindowStore.unit.y}
	toggleKey="u"
	bind:visibility={WindowStore.unit.visible}
>
	{#snippet title()}
		<h4 class="my-2">Management</h4>
	{/snippet}
	{#snippet body()}
		<h5>Your city - population {CityController.population}</h5>

		<div class="my-4">
			<UnitDesignator
				name="Soldiers"
				iconPath="/units/soldier.jpg"
				bind:unit={CityController.units.soldiers}
				bind:available={CityController.workers}
			/>
			<UnitDesignator
				name="Merchants"
				iconPath="/units/merchant.jpg"
				bind:unit={CityController.units.merchants}
				bind:available={CityController.workers}
			/>
			<UnitDesignator
				name="Smiths"
				iconPath="/units/smith.jpg"
				bind:unit={CityController.units.smiths}
				bind:available={CityController.workers}
			/>
			<UnitDesignator
				name="Priests"
				iconPath="/units/priest.jpg"
				bind:unit={CityController.units.priests}
				bind:available={CityController.workers}
			/>
		</div>

		<h5>Workers {CityController.workers}</h5>
	{/snippet}
	{#snippet footer()}
		{#each queue.queue as q (q.name + q.time.start)}
			<p class="my-1">
				{q.name}
				{timeLeft(q.time.end)}
			</p>
		{/each}
	{/snippet}
</Window>
