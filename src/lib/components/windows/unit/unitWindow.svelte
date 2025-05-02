<script lang="ts">
	import CityStore from '$lib/stores/city.svelte';
	import Window from '$lib/features/window/window.svelte';
	import UnitDesignator from '$lib/components/windows/unit/unitDesignator.svelte';
	import type { QueueItem } from '$lib/types/queueItem';
	import { onDestroy } from 'svelte';
	import dayjs from 'dayjs';
	import WindowStore from '$lib/stores/windows.svelte';

	let queue: QueueItem[] = $state([
		{
			name: "Worker => soldier",
			time: { start: new Date(), end: dayjs().add(15, 'seconds').toDate() },
			onComplete: () => {
				CityStore.soldiers += 1;
			}
		}
	]);

	const timer = setInterval(() => {
		for (const q of queue) {
			if (dayjs(q.time.end).isBefore(dayjs())) {
				q.onComplete();
				queue = queue.filter((item) => item !== q);
				// Logger here later
			}
		}
	}, 1000);

	function secondsToHMS(totalSeconds: number): { h: number; m: number; s: number } {
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		return { h, m, s };
	}

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window height={600} width={400} x={200} y={200} toggleKey="u" bind:visibility={WindowStore.unitVisibility}>
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
			{@const { h, m, s } = secondsToHMS(dayjs(q.time.end).diff(dayjs(), 'second'))}
			<p class="my-1">
				{q.name}
				{#if h}{h}:{/if}
				{#if h || m}{m.toString().padStart(2, '0')}:{/if}
				{s.toString().padStart(2, '0')}
			</p>
		{/each}
	{/snippet}
</Window>
