<script lang="ts">
  import type { MapWithClickBox } from "$lib/types/mapTypes";
  import MapController from "$lib/controller/map.svelte";
  import { dev } from "$app/environment";

  function onBack() {
    if (MapController.currentMapState?.previous) {
      MapController.currentMapState = MapController.currentMapState.previous;
    }
  }

  function newZone() {
    if (!MapController.currentMapState) {
      return;
    }

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
        name: "New Zone",
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
    }
  }

  function changeSelectedBoxDestination(event: Event) {
    const destination = event.currentTarget;
    if (!(destination instanceof HTMLSelectElement)) {
      return;
    }

    MapController.setSelectedBoxDestination(destination.value);
  }
</script>

{#if MapController.currentMapState}
  <h3>{MapController.currentMapState.map?.name}</h3>
  <div class="border rounded shadow p-2 mb-2">
      {#if MapController.currentMapState.previous}
        <button class="btn btn-primary" type="button" onclick={onBack}>Back</button>
      {/if}
      {#if dev}
        <button type="button" class="btn btn-primary" onclick={newZone}>New</button>
        <button type="button" class="btn btn-primary" onclick={toggleEditMode}
          >Edit Mode [<b>{MapController.editMode ? "on" : "off"}</b>]</button
        >
        {#if MapController.editMode && MapController?.selectedBox}
            <section class="map-editor position-fixed border rounded shadow p-3" aria-label="Map box editor">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h4 class="h5 mb-0">Edit map box</h4>
                    <button type="button" class="btn-close" aria-label="Close editor" onclick={toggleEditMode}></button>
                </div>
                <div class="row g-2">
                    <div class="col-12">
                      <label for="destination" class="form-label">Leads to</label>
                    <select
                      id="destination"
                      class="form-select"
                      value={MapController.selectedBox.map.name}
                      onchange={changeSelectedBoxDestination}
                    >
                      {#each MapController.maps as destination (destination.map.name)}
                        <option value={destination.map.name}>{destination.map.name}</option>
                      {/each}
                    </select>
                    </div>
                    <div class="col-6">
                      <label for="sheight" class="form-label">Height</label>
                      <input id="sheight" type="number" class="form-control" bind:value={MapController.selectedBox.clickBox.height} />
                    </div>
                    <div class="col-6">
                      <label for="swidth" class="form-label">Width</label>
                    <input id="swidth" type="number" class="form-control" bind:value={MapController.selectedBox.clickBox.width} />
                    </div>
                    <div class="col-12">
                      <label for="srotation" class="form-label">Rotation</label>
                    <input id="srotation" type="number" class="form-control" bind:value={MapController.selectedBox.clickBox.rotation} />
                    </div>
                    <div class="col-6">
                      <label for="sx" class="form-label">X</label>
                    <input id="sx" type="number" class="form-control" bind:value={MapController.selectedBox.clickBox.x} />
                    </div>
                    <div class="col-6">
                    <label for="sy" class="form-label">Y</label>
                      <input id="sy" type="number" class="form-control" bind:value={MapController.selectedBox.clickBox.y} />
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
            </section>
        {/if}
      {/if}
  </div>
{/if}

<style>
    .border {
        background-color: rgba(255, 255, 255, 0.5);
    }

    .map-editor {
        top: 2rem;
        right: 2rem;
        z-index: 1050;
        width: min(calc(100% - 4rem), 22rem);
        max-height: calc(100vh - 4rem);
        overflow-y: auto;
        background-color: rgba(229, 234, 240, 0.97);
        border-color: rgba(105, 114, 126, 0.5) !important;
    }

    .map-editor :global(.form-control),
    .map-editor :global(.form-select) {
        background-color: #fff;
        border-color: #aab4c0;
        box-shadow: 0 1px 2px rgba(35, 45, 60, 0.14);
    }
</style>
