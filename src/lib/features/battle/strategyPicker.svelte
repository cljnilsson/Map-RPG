<script lang="ts">
    let {strategyOptions, strat = $bindable()}: {strategyOptions: string[], strat: string | undefined} = $props();
</script>

<div class="row justify-content-center my-3">
    <div class="col-auto">
        <h5>Strategy</h5>
        {#each strategyOptions as s, i}
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    name="radioDefault"
                    id={`radioDefault${i}`}
                    bind:group={strat}
                    value={s}
                />
                <label
                    class="form-check-label"
                    for={`radioDefault${i}`}
                >
                    {s}
                </label>
            </div>
        {/each}
    </div>
</div>