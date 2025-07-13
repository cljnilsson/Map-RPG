<script lang="ts">
	import BookPage from "$lib/features/book/bookPage.svelte";
	import BookStore from "$lib/stores/book.svelte";

	let currentPage = $state(0);
	let visible = $state(true);
</script>

{#if visible && BookStore.currentBook && BookStore.currentBook.length > 0}
	<div class="row book my-3 mx-3 text-light">
		{#if BookStore.currentBook.length === 1}
			<BookPage bind:currentPage page={currentPage} pages={BookStore.currentBook} bind:visible />
		{:else}
			<BookPage bind:currentPage page={currentPage} pages={BookStore.currentBook} bind:visible />
			<BookPage bind:currentPage page={currentPage + 1} pages={BookStore.currentBook} bind:visible />
		{/if}
	</div>
{/if}

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
