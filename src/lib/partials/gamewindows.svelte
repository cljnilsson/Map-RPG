<script lang="ts">
	import VendorWindow from "$lib/components/windows/vendor/vendor.svelte";
	import ContainerWindow from "$lib/components/windows/container/container.svelte";
	import Book from "$lib/features/book/book.svelte";
	import VendorStore from "$lib/stores/vendor.svelte";
	import ContainerStore from "$lib/stores/container.svelte";
</script>

{#if !!VendorStore.currentVendor}
	<VendorWindow vendor={VendorStore.currentVendor} />
{/if}

{#if !!ContainerStore.object}
	<ContainerWindow />
{/if}

<Book />