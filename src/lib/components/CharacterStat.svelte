<script lang="ts">
    let {name, value}: {name: string, value: number} = $props();
</script>
<div class="row">
    <div class="col-xl-8 col-sm-10">
        <p class="py-1">{name}</p>
    </div>
    <div class="col-auto">
        <p class="py-1" class:text-danger={value <= 5} class:text-warning={value > 5 && value <= 8} class:text-success={value >= 9}>{value}</p>
    </div>
</div>

<style>
    p {
        margin-bottom: 0;
    }
</style>