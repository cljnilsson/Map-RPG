<script lang="ts">
    import type { MapWithClickBox } from "$lib/types/mapTypes";
    import MapController from "$lib/controller/map.svelte";
    import { dev } from "$app/environment";
    import Popup from "$lib/components/popup/popup.svelte";

    let activePopup = $state<"box" | "map" | null>(null);
    let newMapName = $state("");
    let newMapImagePath = $state("");
    let newMapType = $state<"world" | "city" | "building">("world");
    let newMapError = $state("");

    $effect(() => {
        if (!MapController.editMode) {
            activePopup = null;
            return;
        }

        if (MapController.selectedBox && activePopup === null) {
            activePopup = "box";
        }
    });

    function onBack() {
        if (MapController.currentMapState?.previous) {
            MapController.currentMapState =
                MapController.currentMapState.previous;
        }
    }

    function getAvailableNewZoneName(index = 1): string {
        const name = index === 1 ? "New Zone" : `New Zone ${index}`;

        return MapController.getSubMapByName(name)
            ? getAvailableNewZoneName(index + 1)
            : name;
    }

    function newZone() {
        if (!MapController.currentMapState || !MapController.editMode) {
            return;
        }

        activePopup = "box";
        const name = getAvailableNewZoneName();

        const newObj: MapWithClickBox = {
            clickBox: {
                x: 50,
                y: 150,
                originalX: 50,
                originalY: 150,
                width: 100,
                height: 100,
                rotation: 0,
            },
            map: {
                type: "world",
                name,
                imagePath: "",
            },
        };

        MapController.addSubmap(newObj);
        MapController.editMode = true;
        MapController.selectedBox = newObj;
    }

    function toggleEditMode() {
        MapController.editMode = !MapController.editMode;
        if (MapController.editMode === false) {
            MapController.selectedBox = null;
            activePopup = null;
        }
    }

    function changeSelectedBoxDestination(event: Event) {
        const destination = event.currentTarget;
        if (!(destination instanceof HTMLSelectElement)) {
            return;
        }

        MapController.setSelectedBoxDestination(destination.value);
    }

    function openNewMapForm() {
        if (!MapController.editMode) {
            return;
        }

        newMapName = "";
        newMapImagePath = "";
        newMapType = "world";
        newMapError = "";
        activePopup = "map";
    }

    function createNewMap(event: SubmitEvent) {
        event.preventDefault();
        if (!MapController.editMode) {
            return;
        }

        const newMap = MapController.createMap({
            name: newMapName,
            imagePath: newMapImagePath,
            type: newMapType,
        });

        if (!newMap) {
            newMapError = "Enter a unique map name and an image path.";
            return;
        }

        if (MapController.selectedBox) {
            MapController.setSelectedBoxDestination(newMap.map.name);
        }

        activePopup = MapController.selectedBox ? "box" : null;
    }
</script>

{#if MapController.currentMapState}
    <h3>{MapController.currentMapState.map?.name}</h3>
    <div class="border rounded shadow p-2 mb-2">
        {#if MapController.currentMapState.previous}
            <button class="btn btn-primary" type="button" onclick={onBack}
                >Back</button
            >
        {/if}
        {#if dev}
            <button
                type="button"
                class="btn btn-primary"
                onclick={toggleEditMode}
                >Edit Mode [<b>{MapController.editMode ? "on" : "off"}</b
                >]</button
            >
            {#if MapController.editMode}
                <button type="button" class="btn btn-primary" onclick={newZone}
                    >New location</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={openNewMapForm}>New map</button
                >
            {/if}
            {#if activePopup === "box" || activePopup === "map"}
                <span>{activePopup}</span>
            {:else}
                <span>None</span>
            {/if}
            {#if MapController.editMode && MapController?.selectedBox && activePopup === "box"}
                <Popup
                    bind:activePopup
                    createNewMap={newZone}
                    title="Edit Location Box"
                    key="box"
                >
                    <div class="row g-2">
                        <div class="col-12">
                            <label for="destination" class="form-label"
                                >Leads to</label
                            >
                            <select
                                id="destination"
                                class="form-select"
                                value={MapController.selectedBox.map.name}
                                onchange={changeSelectedBoxDestination}
                            >
                                {#each MapController.maps as destination (destination.map.name)}
                                    <option value={destination.map.name}
                                        >{destination.map.name}</option
                                    >
                                {/each}
                            </select>
                        </div>
                        <div class="col-6">
                            <label for="sheight" class="form-label"
                                >Height</label
                            >
                            <input
                                id="sheight"
                                type="number"
                                class="form-control"
                                bind:value={
                                    MapController.selectedBox.clickBox.height
                                }
                            />
                        </div>
                        <div class="col-6">
                            <label for="swidth" class="form-label">Width</label>
                            <input
                                id="swidth"
                                type="number"
                                class="form-control"
                                bind:value={
                                    MapController.selectedBox.clickBox.width
                                }
                            />
                        </div>
                        <div class="col-12">
                            <label for="srotation" class="form-label"
                                >Rotation</label
                            >
                            <input
                                id="srotation"
                                type="number"
                                class="form-control"
                                bind:value={
                                    MapController.selectedBox.clickBox.rotation
                                }
                            />
                        </div>
                        <div class="col-6">
                            <label for="sx" class="form-label">X</label>
                            <input
                                id="sx"
                                type="number"
                                class="form-control"
                                bind:value={
                                    MapController.selectedBox.clickBox.x
                                }
                            />
                        </div>
                        <div class="col-6">
                            <label for="sy" class="form-label">Y</label>
                            <input
                                id="sy"
                                type="number"
                                class="form-control"
                                bind:value={
                                    MapController.selectedBox.clickBox.y
                                }
                            />
                        </div>
                    </div>
                    {#if MapController.isSelectedBoxInCurrentMap()}
                        <div class="border-top mt-3 pt-3">
                            <button
                                type="button"
                                class="btn btn-danger w-100"
                                onclick={() => {
                                    if (MapController.selectedBox) {
                                        MapController.removeSubmapByName(
                                            MapController.selectedBox.map.name,
                                        );
                                        MapController.selectedBox = null;
                                    }
                                }}
                            >
                                Delete box
                            </button>
                        </div>
                    {/if}
                </Popup>
            {:else if MapController.editMode && activePopup === "map"}
                <Popup
                    bind:activePopup
                    {createNewMap}
                    title="Edit Map"
                    key="map"
                >
                    <div class="mb-3">
                        <label for="new-map-name" class="form-label"
                            >Map name</label
                        >
                        <input
                            id="new-map-name"
                            class="form-control"
                            required
                            bind:value={newMapName}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="new-map-image" class="form-label"
                            >Image path</label
                        >
                        <input
                            id="new-map-image"
                            class="form-control"
                            placeholder="/maps/new-map.webp"
                            required
                            bind:value={newMapImagePath}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="new-map-type" class="form-label"
                            >Map type</label
                        >
                        <select
                            id="new-map-type"
                            class="form-select"
                            bind:value={newMapType}
                        >
                            <option value="world">World</option>
                            <option value="city">City</option>
                            <option value="building">Building</option>
                        </select>
                    </div>
                    {#if newMapError}
                        <div class="alert alert-danger py-2" role="alert">
                            {newMapError}
                        </div>
                    {/if}
                    <button type="submit" class="btn btn-primary w-100"
                        >Add map</button
                    >
                </Popup>
            {/if}
        {/if}
    </div>
{/if}
