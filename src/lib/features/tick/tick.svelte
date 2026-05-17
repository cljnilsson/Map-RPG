<script lang="ts">
    import { now } from "$lib/api/server.remote";
    import dayjs from "dayjs";
    import { Tween } from "svelte/motion";

    let test = new Tween(0, { duration: 0 });

    let timestamp = $state(0);
    let nextUpdate = $state(0);
    let initialRemaining = $state(0);
    let currentTime = $state(Date.now());

    /*function tick() {
        currentTime = Date.now();
        requestAnimationFrame(tick);
    }

    tick();

    const progress = $derived.by(() => {
        if (!nextUpdate) return 0;

        const remaining = nextUpdate - currentTime;
        //console.log(Math.round(100 - (remaining / initialRemaining) * 100));

        return Math.round(100 - (remaining / initialRemaining) * 100);
        });*/
    const nextUpdateCountdown = $derived(
        Math.max(0, Math.ceil((nextUpdate - currentTime) / 1000)),
    );

    $effect(() => {
        now().then((result) => {
            nextUpdate = result.nextUpdate;
            timestamp = result.timestamp;
            initialRemaining = result.nextUpdate - Date.now();
            test.target = 0;
            test.set(100, { duration: initialRemaining });
        });
    });
</script>

<p>
    the time is {dayjs(timestamp).format("HH:mm:ss")} next update is in
    {nextUpdateCountdown} seconds
</p>
<!--<progress class="" max="100" value={progress}>{progress}%</progress>-->
<progress class="" max="100" value={test.current}>{test.current}%</progress>
