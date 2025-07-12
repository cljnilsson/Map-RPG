<script lang="ts">
	import BookPage from "$lib/features/book/bookPage.svelte";

	let { pages }: { pages: string[] } = $props();
	let currentPage = $state(0);
</script>

<div class="row book my-3 mx-3 text-light">
	{#if pages.length === 1}
		<BookPage bind:currentPage page={currentPage} {pages} />
	{:else}
		<BookPage bind:currentPage page={currentPage} {pages} />
		<BookPage bind:currentPage page={currentPage + 1} {pages} />
	{/if}
</div>

<style lang="scss">
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

	.bi {
		font-size: 3rem;
		background: none;
		background-color: transparent;
	}
</style>
