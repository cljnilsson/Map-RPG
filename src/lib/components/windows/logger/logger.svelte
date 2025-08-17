<script lang="ts">
	import dayjs from "dayjs";
	import LogStore from "$lib/stores/logs.svelte";
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";

	let currentLogs = $derived(
		LogStore.logs.slice((LogStore.currentPage - 1) * 8, LogStore.currentPage * 8)
	);
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	uniqueKey="Logger"
	height={400}
	width={700}
	x={WindowController.logger.x}
	y={WindowController.logger.y}
	toggleKey="l"
	bind:visibility={WindowController.logger.visible}
>
	{#snippet title()}
		<h4 class="my-2">Log</h4>
	{/snippet}
	{#snippet body()}
		{#each currentLogs as logEntry}
			<p>[{dayjs(logEntry.timestamp).format("HH:mm")}] {logEntry.message}</p>
		{/each}
	{/snippet}
	{#snippet footer()}
		<button
			class="btn btn-light mx-1"
			onclick={() => (LogStore.currentPage -= 1)}
			disabled={LogStore.currentPage <= 1}
		>
			Previous
		</button>
		<button
			class="btn btn-light mx-1"
			onclick={() => (LogStore.currentPage += 1)}
			disabled={LogStore.currentPage >= Math.ceil(LogStore.logs.length / 8)}
		>
			Next
		</button>
	{/snippet}
</Window>
