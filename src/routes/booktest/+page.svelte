<script lang="ts">
    import Book from "$lib/features/book/book.svelte";
    import BookStore from "$lib/stores/book.svelte";

	BookStore.currentBook = ["<h3>Test title</h3><p>Something here</p>", "<h3>Another page</h3><p>More content</p>"];
</script>

<Book />