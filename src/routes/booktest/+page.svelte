<script lang="ts">
    import Book from "$lib/features/book/book.svelte";

	let pages: string[] = ["<h3>Test title</h3><p>Something here</p>", "<h3>Another page</h3><p>More content</p>"];
</script>

<Book {pages} />