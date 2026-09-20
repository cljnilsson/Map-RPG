<script lang="ts">
    let {min, max, total, totalMax, stat = $bindable(), name, totalLeft, size = "md", darkMode = false}: {
        stat: number, min: number, max: number, total: number, totalMax: number, name: string, totalLeft: number,
        /** Compact rows fit floating windows; medium preserves the creator layout. */
        size?: "sm" | "md" | "lg";
        /** Use light text and controls on a dark background. */
        darkMode?: boolean;
    } = $props();

    const buttonClass = $derived(`btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"} ${size === "md" ? "" : `btn-${size}`}`);
</script>

<div class={`row justify-content-center align-items-center my-2 stat-${name}`} class:g-2={size === "sm"} class:flex-nowrap={size === "sm"} class:text-light={darkMode} class:text-dark={!darkMode}>
    <div class={size === "sm" ? "col text-break" : "col-xl-2 col-md-4"}>
        {name}
    </div>
    <div class="col-auto fw-semibold">
        {stat}
    </div>
    <div class={size === "sm" ? "col-auto d-flex gap-2 flex-nowrap" : "col-xl-2 col-md-6 text-center"}>
        <button type="button" class={buttonClass} aria-label={`Increase ${name}`} onclick={() => stat += 1} disabled={total >= totalMax || stat >= max || totalLeft <= 0}>+</button>
        <button type="button" class={buttonClass} aria-label={`Decrease ${name}`} onclick={() => stat -= 1} disabled={stat <= min}>-</button>
    </div>
</div>
