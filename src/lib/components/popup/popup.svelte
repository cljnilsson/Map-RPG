<script lang="ts">
    import MapController from "#lib/controller/map.svelte.js";
    let {
        children,
        activePopup = $bindable(),
        createNewMap,
        title,
        key
    }: {
        children: import("svelte").Snippet;
        activePopup: string | null;
        createNewMap: (event: SubmitEvent) => void;
        title: string,
        key: string
    } = $props();
</script>

<section
    class="map-editor position-fixed border rounded shadow p-3"
    aria-label="New map editor"
>
    <div class="d-flex align-items-center justify-content-between mb-3">
        <h4 class="h5 mb-0">{title}</h4>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn-close"
                aria-label="Close new map editor"
                onclick={() =>
                    (activePopup = MapController.selectedBox ? key : null)}
            ></button>
        </div>
    </div>
    <form onsubmit={createNewMap}>
        {@render children()}
    </form>
</section>
