<script lang="ts">
    let { viewFull }: { viewFull: boolean } = $props();
</script>

<div class="row">
    {#if viewFull}
        <div class="col-fixed">From</div>
        <div class="col-arrow g-0"></div>
        <div class="col-fixed">To</div>
        <div class="col-angle g-0">Angle</div>
        <div class="col-actions"></div>
    {:else}
        <div class="col-fixed">Node</div>
        <div class="col-angle g-0">Angle</div>
    {/if}
</div>

<style>
    .col-fixed {
        width: 90px; /* adjust based on your data */
        font-variant-numeric: tabular-nums; /* keeps numbers aligned nicely */
    }

    .col-arrow {
        width: 40px;
        text-align: center;
    }

    .col-angle {
        width: 45px;
    }

    .col-actions {
        flex: 1;
    }
</style>
