<script lang="ts">
	import BookPage from "$lib/features/book/bookPage.svelte";
	import BookStore from "$lib/stores/book.svelte";
</script>

{#if BookStore.visible && BookStore.currentBook && BookStore.currentBook.length > 0}
	<div class="row justify-content-center book my-3 mx-3 text-light">
		{#if BookStore.currentBook.length === 1}
			<BookPage
				bind:currentPage={BookStore.currentPage}
				page={BookStore.currentPage}
				pages={BookStore.currentBook}
				bind:visible={BookStore.visible}
			/>
		{:else}
			<BookPage
				bind:currentPage={BookStore.currentPage}
				page={BookStore.currentPage}
				pages={BookStore.currentBook}
				bind:visible={BookStore.visible}
			/>
			<BookPage
				bind:currentPage={BookStore.currentPage}
				page={BookStore.currentPage + 1}
				pages={BookStore.currentBook}
				bind:visible={BookStore.visible}
			/>
		{/if}
	</div>
{/if}

<style lang="scss">
	.book {
		height: 700px;
		width: 900px;
		font-family: "IMFellEnglish";
		src: url("IMFellEnglish-Regular.ttf") format("truetype");
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 100000;
	}
</style>
