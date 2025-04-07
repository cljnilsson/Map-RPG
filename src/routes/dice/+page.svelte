<script lang="ts">
  import Die from '$lib/features/die/die.svelte';
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
</svelte:head>

<div class="wrapper mt-5 mx-5 px-5">
    <Die/>
    <Die/>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>