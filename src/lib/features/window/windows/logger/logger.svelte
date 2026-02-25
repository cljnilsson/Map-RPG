<script lang="ts">
  import dayjs from "dayjs";
  import LogController from "$lib/controller/logs.svelte";
  import Window from "$lib/features/window/window.svelte";
  import WindowController from "$lib/controller/window.svelte";
  import { dev } from "$app/environment";
  import { fly } from "svelte/transition";

  let currentLogs = $derived(
    LogController.logs.slice(
      (LogController.currentPage - 1) * 8,
      LogController.currentPage * 8,
    ),
  );

  let logsWindow = WindowController.getByName("Logger");
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
  uniqueKey="Logger"
  height={400}
  width={700}
  x={logsWindow.x}
  y={logsWindow.y}
  toggleKey="l"
  bind:visibility={logsWindow.visible}
>
  {#snippet title()}
    <h4 class="my-2">Log</h4>
  {/snippet}
  {#snippet body()}
    {#each currentLogs as logEntry, i (i)}
      <p in:fly={{ y: 6, duration: 180 }}>
        [{dayjs(logEntry.timestamp).format("HH:mm")}] <span style={"color:" + logEntry.color ? logEntry.color : "default" +";"}>{logEntry.message}</span>
      </p>
    {/each}
  {/snippet}
  {#snippet footer()}
    <button
      type="button"
      class="btn btn-light mx-1"
      onclick={() => (LogController.currentPage -= 1)}
      disabled={LogController.currentPage <= 1}
    >
      Previous
    </button>
    <button
      type="button"
      class="btn btn-light mx-1"
      onclick={() => (LogController.currentPage += 1)}
      disabled={LogController.currentPage >=
        Math.ceil(LogController.logs.length / 8)}
    >
      Next
    </button>
    {#if dev}
      <button
        type="button"
        class="btn btn-light mx-1"
        onclick={() => LogController.newLog("Test")}
      >
        Test
      </button>
    {/if}
  {/snippet}
</Window>
