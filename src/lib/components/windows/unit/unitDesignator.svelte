<script lang="ts">
    let {available = $bindable(), unit = $bindable(), name}: {unit: number, available: number, name: string} = $props();
    const min = 0;

    function onAdd() {
        unit += 1;
        available -= 1;
    }

    function onRemove() {
        unit -= 1;
        available += 1;
    }
</script>

<div class="row my-2">
    <div class="col-xl-3 col-md-6">
        {name}
    </div>
    <div class="col-xl-1 col-md-2">
        {unit}
    </div>
    <div class="col-xl-3 col-md-5 text-center">
        <button class="btn btn-outline-light" onclick={onAdd} disabled={available > 0}>+</button>
        <button class="btn btn-outline-light" onclick={onRemove} disabled={unit <= min}>-</button>
    </div>
</div>