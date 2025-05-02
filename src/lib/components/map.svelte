<script lang="ts">
	import MapClickBoxes from '$lib/partials/mapClickboxes.svelte';
	import MapStore from '$lib/stores/map.svelte';
</script>

{#if MapStore.currentMapState}
	<div class="map-container">
		<img
			loading="lazy"
			src={MapStore.currentMapState.map?.imagePath}
			class={MapStore.currentMapState.map.type}
			alt="test"
			draggable="false"
		/>
		<MapClickBoxes></MapClickBoxes>
	</div>
	<div class="position-fixed bottom-0 start-0 m-3">
		<div class="bg-light border rounded shadow py-2 row g-0">
		  <div class="col px-2">
			<img id="avatar" src="/char.jpg" alt="Your character" loading="lazy" class="img-fluid rounded" />
			<div
			  class="progress mt-2"
			  role="progressbar"
			  aria-label="Success example"
			  aria-valuenow="90"
			  aria-valuemin="0"
			  aria-valuemax="100"
			>
			  <div class="progress-bar bg-success" style="width: 90%">90 / 100</div>
			</div>
		  </div>
		  <div class="col px-2">
			<button class="btn btn-primary btn-sm d-block mb-2">Option 1</button>
			<button class="btn btn-secondary btn-sm d-block mb-2">Option 2</button>
			<button class="btn btn-danger btn-sm d-block">Option 3</button>
		  </div>
		</div>
	  </div>
	  
{/if}

<style>
	#avatar {
		height: 100px;
		
	}

	.map-container {
		position: relative;
	}

	img {
		pointer-events: none;
		user-select: none;
 		-webkit-user-select: none; /* for Safari */
	}
	img.city,
	img.building {
		height: 90vh;
		width: 100%;
		display: block;
	}
</style>
