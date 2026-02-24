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
        {#if MapController.editMode && MapController.selectedBox && MapController.isSelectedBoxInCurrentMap()}
          <button
            type="button"
            class="btn btn-primary"
            onclick={() => {
              if (MapController.selectedBox) {
                MapController.removeSubmapByName(
                  MapController.selectedBox.map.name,
                );
                MapController.selectedBox = null;
              }
            }}
          >
            Delete
          </button>
        {/if}
        {#if MapController.editMode && MapController?.selectedBox}
            <div class="row">
                <div class="col-12 col-xl-3">
                    <label for="sheight">Height</label>
    				<input type="number" name="sheight" class="form-control" placeholder="Height" bind:value={MapController.selectedBox.clickBox.height} />
    				<label for="swidth">Width</label>
                    <input type="number" name="swidth" class="form-control" placeholder="Width" bind:value={MapController.selectedBox.clickBox.width} />
    				<label for="srotation">Rotation</label>
                    <input type="number" name="srotation" class="form-control" placeholder="Rotation" bind:value={MapController.selectedBox.clickBox.rotation} />
    				<label for="sx">X</label>
                    <input type="number" name="sx" class="form-control" placeholder="X" bind:value={MapController.selectedBox.clickBox.x} />
                    <label for="sy">Y</label>
    				<input type="number" name="sy" class="form-control" placeholder="Y" bind:value={MapController.selectedBox.clickBox.y} />
                </div>
            </div>
        {/if}
      {/if}
  </div>
{/if}

<style>
    .border {
        background-color: rgba(255, 255, 255, 0.5);
    }
</style>
