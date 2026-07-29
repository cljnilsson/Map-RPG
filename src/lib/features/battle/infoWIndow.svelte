<script lang="ts">
    type statBase = {name: string, description: string};
    type stat = {value: number} & statBase;
    type Unit = {name: string, amount: number, icon: string, stats: stat[]};

    let {friendly = true, hovering}: {hovering: Unit | null, friendly?: boolean} = $props();

</script>

{#if hovering}
    <div
        class="position-absolute rounded top-0 end-0 border col-3 bg-dark text-light m-2 p-2"
    >
        <h3 class="shadow" class:text-primary={friendly} class:text-danger={!friendly}>
            {hovering.name}
        </h3>
        <p>Woooo</p>
        <div class="border p-2">
            {#each hovering.stats as s}
                <p class="mb-0">{s.name}: <b>{s.value}</b></p>
            {/each}
        </div>
    </div>
{/if}