<script lang="ts">
    let {
        saves,
        saveName,
        saveSelector = $bindable(),
    }: {
        saveName: string;
        saves: string[];
        saveSelector: string;
    } = $props();

    function onLoad() {
        console.log("Tries to load");
    }
</script>

<div class="mt-3 mb-2 row">
    <div class="col">
        <button
            type="button"
            class="btn btn-primary"
            disabled={saveName === "Select Save"}
            onclick={onLoad}>Load</button
        >
    </div>
    <div class="col">
        <div class="dropdown">
            <button
                class="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {saveSelector}
            </button>
            <ul class="dropdown-menu">
                {#each saves as s}
                    <li>
                        <button
                            type="button"
                            class="dropdown-item"
                            onclick={() => (saveSelector = s)}
                        >
                            {s}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
