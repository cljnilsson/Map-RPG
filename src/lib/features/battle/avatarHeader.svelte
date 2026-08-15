<script lang="ts">
    import { PlayerController } from "#lib/controller/character.svelte.js";
    
    const width = 200;
    const height = 200;
</script>

<div class="row">
    <div class="col text-end">
        <img
            src={PlayerController.imagePath}
            alt="Your character"
            loading="lazy"
            fetchpriority="high"
            style="width: {width}px;
                        height: {height}px;"
        />
    </div>
    <div class="col">
        <img
            src={"/orc.png"}
            alt="Enemy"
            loading="lazy"
            fetchpriority="high"
            style="width: {width}px;
                        height: {height}px;"
        />
    </div>
</div>
