<script lang="ts">
	import CityStore from "$lib/stores/city.svelte";
	import LoggerStore from "$lib/stores/logs.svelte";
	import Window from "$lib/features/window/window.svelte";
	import UnitDesignator from "$lib/components/windows/unit/unitDesignator.svelte";
	import type { QueueItem } from "$lib/types/queueItem";
	import { onDestroy } from "svelte";
	import dayjs from "dayjs";
	import WindowStore from "$lib/stores/windows.svelte";

	let queue: QueueItem[] = $state([
		{
			name: "Worker => soldier",
			time: { start: new Date(), end: dayjs().add(15, "seconds").toDate() },
			onComplete: () => {
				CityStore.soldiers += 1;
			}
		}
	]);

	const timer = setInterval(() => {
		for (const q of queue) {
			console.log(dayjs(q.time.end).diff(dayjs(), "second"));
			if (dayjs(q.time.end).isBefore(dayjs())) {
				q.onComplete();
				queue = queue.filter((item) => item !== q);
				LoggerStore.logs = [
					...LoggerStore.logs,
					{
						type: "info",
						timestamp: new Date(),
						message: `Finished training ${q.name}`
					}
				];
			}
		}

		if (queue.length > 0) {
			// Force update in order to show duration left
			queue = [...queue];
		}
	}, 1000);

	function secondsToHMS(totalSeconds: number): { h: number; m: number; s: number } {
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		return { h, m, s };
	}

	function timeLeft(q: QueueItem): string {
		const { h, m, s } = secondsToHMS(dayjs(q.time.end).diff(dayjs(), "second"));

		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
			.toString()
			.padStart(2, "0")}`;
	}

	onDestroy(() => {
		clearInterval(timer);
	});
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
				bind:queue
			/>
			<UnitDesignator
				name="Merchants"
				bind:unit={CityStore.merchants}
				bind:available={CityStore.workers}
				bind:queue
			/>
			<UnitDesignator
				name="Smiths"
				bind:unit={CityStore.smiths}
				bind:available={CityStore.workers}
				bind:queue
			/>
			<UnitDesignator
				name="Priests"
				bind:unit={CityStore.priests}
				bind:available={CityStore.workers}
				bind:queue
			/>
		</div>

		<h5>Workers {CityStore.workers}</h5>
	{/snippet}
	{#snippet footer()}
		{#each queue as q}
			<p class="my-1">
				{#key queue}
					{q.name} {timeLeft(q)}
				{/key}
			</p>
		{/each}
	{/snippet}
</Window>
