<script lang="ts">
    let {name, value}: {name: string, value: number} = $props();
</script>
<div class="row">
    <div class="col-xl-8 col-sm-10">
        <p class="py-1">{name}</p>
    </div>
    <div class="col-2">
        <p class="py-1 outlined" class:text-danger={value <= 5} class:text-warning={value > 5 && value <= 8} class:text-success={value >= 9}>{value}</p>
    </div>
</div>

<style>
    .outlined {
        text-shadow: 0 0 2px #000;
    }

    p {
        margin-bottom: 0;
    }
</style>