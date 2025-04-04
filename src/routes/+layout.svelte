<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.js?url";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "./styles.scss";
	import Nav from '$lib/partials/nav.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" type="image/svg" href="/facicon.png" />
	<script src={scriptSrc}></script>
</svelte:head>

<div class="container-fluid">
    <Nav></Nav>
    {@render children()}
</div>