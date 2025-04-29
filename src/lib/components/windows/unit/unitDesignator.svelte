<script lang="ts">
    let {available = $bindable(), unit = $bindable(), name, queue = $bindable()}: {unit: number, available: number, name: string, queue: { from: string; to: string; timeLeftSeconds: number }[]} = $props();
    const min = 0;

    function onAdd() {
        unit += 1;
        available -= 1;
        queue = [...queue, { from: "Worker", to: name, timeLeftSeconds: 90 }];
    }

    function onRemove() {
        unit -= 1;
        available += 1;
        queue = [...queue, { from: name, to: "Worker", timeLeftSeconds: 90 }];
    }
</script>

<div class="row my-2 justify-content-center">
    <div class="col-xl-3 col-md-6">
        {name}
    </div>
    <div class="col-xl-1 col-md-2">
        {unit}
    </div>
    <div class="col-xl-3 col-md-5 text-center">
        <button class="btn btn-outline-light" onclick={onAdd} disabled={available <= 0}>+</button>
        <button class="btn btn-outline-light" onclick={onRemove} disabled={unit <= min}>-</button>
    </div>
</div>