<script lang="ts">
	import BookPage from "$lib/features/book/bookPage.svelte";

	let {page}: { page: string } = $props();
	let currentPage = $state(0);
    let visible = $state(true);
</script>

{#if visible}
    <div class="row book my-3 mx-3 text-light">
		<BookPage bind:currentPage page={currentPage} pages={[page]} bind:visible />
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
