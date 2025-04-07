<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import './styles.scss';
	import "animate.css";
	import Nav from '$lib/partials/nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/facicon.png" />
	<script src={scriptSrc}></script>
</svelte:head>

<div class="container-fluid p-0">
	<Nav></Nav>
	{@render children()}
</div>

<style>
	.container-fluid {
		background-image: url('/bg.jpg');
		width: 100vw;
		height: 100vh;
		background-size: cover;
		background-repeat: repeat-y;
	}
</style>
