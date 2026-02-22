<script lang="ts">
	let { currentPage = $bindable(), page, pages, visible = $bindable() }: {currentPage: number, page: number, pages: string[], visible: boolean } = $props();

	let pageType: "left" | "right" = $derived(page % 2 === 0 ? "left" : "right");

	function close() {
		visible = false;
	}
</script>


<div class="col-6 book-frame py-3 px-4 d-flex flex-column justify-content-between">
	<div class="row mb-auto">
		<div class="col page-col">
			{#if pages[page]}
				{@html pages[page]}
			{/if}
			{#if pageType === "right" || pages.length === 1}
				<button type="button" class="btn btn-sm text-light close-btn" aria-label="Close" onclick={close}>
					<i class="bi bi-x"></i>
				</button>
			{/if}
		</div>
	</div>
	<div class="row">
		<div class="col" class:text-end={pageType === "right"}>
			{#if pageType === "left"}
				<button type="button" class="btn px-0" disabled={page === 0} aria-label="An arrow pointing to the left" onclick={() => currentPage = page - 1}>
					<i class="bi bi-arrow-bar-left"></i>
				</button>
			{:else}
				<button type="button" class="btn px-0" disabled={page >= pages.length - 1} aria-label="An arrow pointing to the right" onclick={() => currentPage = page + 1}>
					<i class="bi bi-arrow-bar-right"></i>
				</button>
			{/if}
		</div>
	</div>
</div>


<style lang="scss">
	.page-col {
		position: relative;
	}

	.close-btn {
		position: absolute;
		top: -1.5rem;
		right: -1rem;
		z-index: 10;
	}

	.book-frame {
		background: url("parchment.jpg") no-repeat;
		background-size: 100% 700px;
	}

	button {
		&:disabled {
			border: none;
		}
	}

	.bi {
		font-size: 3rem;
		background: none;
		background-color: transparent;
	}
</style>
