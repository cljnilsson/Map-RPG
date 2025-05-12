<script lang="ts">
    let {min, max, total, totalMax, stat = $bindable(), name}: {stat: number, min: number, max: number, total: number, totalMax: number, name: string} = $props();
</script>

<div class={"row justify-content-center align-items-center my-2 stat-" + name}>
    <div class="col-xl-2 col-md-4">
        {name}
    </div>
    <div class="col-xl-1 col-md-2">
        {stat}
    </div>
    <div class="col-xl-4 col-md-6 text-center">
        <button class="btn btn-outline-dark" onclick={() => stat += 1} disabled={total >= totalMax || stat >= max}>+</button>
        <button class="btn btn-outline-dark" onclick={() => stat -= 1} disabled={stat <= min}>-</button>
    </div>
</div>