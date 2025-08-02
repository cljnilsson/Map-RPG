<script lang="ts">
	import VendorWindow from "$lib/components/windows/vendor/vendor.svelte";
	import ContainerWindow from "$lib/components/windows/container/container.svelte";
	import Book from "$lib/features/book/book.svelte";
	import VendorStore from "$lib/stores/vendor.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
</script>

{#if !!VendorStore.currentVendor}
	<VendorWindow vendor={VendorStore.currentVendor} />
{/if}

{#if !!WindowStore.container.object}
	<ContainerWindow />
{/if}

<Book />
