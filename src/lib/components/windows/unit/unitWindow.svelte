<script lang="ts">
	import CityStore from "$lib/stores/city.svelte";
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
			CityStore.soldiers += 1;
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
	height={500}
	width={400}
	x={600}
	y={950}
	toggleKey="u"
	bind:visibility={WindowStore.unitVisibility}
>
	{#snippet title()}
		<h4 class="my-2">Management</h4>
	{/snippet}
	{#snippet body()}
		<h5>Your city - population {CityStore.population}</h5>

		<div class="my-4">
			<UnitDesignator
				name="Soldiers"
				bind:unit={CityStore.soldiers}
				bind:available={CityStore.workers}
			/>
			<UnitDesignator
				name="Merchants"
				bind:unit={CityStore.merchants}
				bind:available={CityStore.workers}
			/>
			<UnitDesignator
				name="Smiths"
				bind:unit={CityStore.smiths}
				bind:available={CityStore.workers}
			/>
			<UnitDesignator
				name="Priests"
				bind:unit={CityStore.priests}
				bind:available={CityStore.workers}
			/>
		</div>

		<h5>Workers {CityStore.workers}</h5>
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
