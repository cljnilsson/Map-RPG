<script lang="ts">
    import { now } from "$lib/api/server.remote";
    import dayjs from "dayjs";

    let timestamp = $state(0);
    let nextUpdate = $state(0);
    let initialRemaining = $state(0);
    let currentTime = $state(Date.now());

    function tick() {
        currentTime = Date.now();
        requestAnimationFrame(tick);
    }

    tick();

    const progress = $derived.by(() => {
        if (!nextUpdate) return 0;

        const remaining = nextUpdate - currentTime;
        //console.log(Math.round(100 - (remaining / initialRemaining) * 100));

        return Math.round(100 - (remaining / initialRemaining) * 100);
    });

    const nextUpdateCountdown = $derived(
        Math.max(0, Math.ceil((nextUpdate - currentTime) / 1000)),
    );

    $effect(() => {
        now().then((result) => {
            nextUpdate = result.nextUpdate;
            timestamp = result.timestamp;
            initialRemaining = result.nextUpdate - Date.now();
        });
    });
</script>

<p>
    the time is {dayjs(timestamp).format("HH:mm:ss")} next update is in
    {nextUpdateCountdown} seconds
</p>
<progress class="w-100" max="100" value={progress}>{progress}%</progress>
