<script lang="ts">
	let pages: string[] = ["<h3>Test title</h3><p>Something here</p>", "<h3>Another page</h3><p>More content</p>"];
	let currentPage = $state(0);
</script>

<div class="row book my-3 mx-3 text-light">
	<div class="col book-frame py-2 px-4 d-flex flex-column justify-content-between">
		<div class="row mb-auto">
			<div class="col">
				{#if pages[currentPage]}
					{@html pages[currentPage]}
				{:else}
					<p>Loading...</p>
				{/if}
			</div>
		</div>
		<div class="row">
			<div class="col">
				<i class="bi bi-arrow-bar-left"></i>
			</div>
		</div>
	</div>
	<div class="col book-frame py-2 px-4 d-flex flex-column justify-content-between">
		<div class="row mb-auto">
			<div class="col">
				{#if pages[currentPage + 1]}
					{@html pages[currentPage + 1]}
				{:else}
					<p>Loading...</p>
				{/if}
			</div>
		</div>
		<div class="row">
			<div class="col text-end">
				<i class="bi bi-arrow-bar-right"></i>
			</div>
		</div>
	</div>
</div>

<style>
	.book {
		height: 700px;
		width: 900px;
		font-family: "IMFellEnglish";
		src: url("IMFellEnglish-Regular.ttf") format("truetype");
	}
	.book-frame {
		background: url("parchment.jpg") no-repeat;
		background-size: 100% 700px;
	}
</style>
