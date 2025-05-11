<script lang="ts">
	let { children } = $props();
</script>

<div class="highlight">
	{@render children()}
</div>

<style>
	.highlight {
		position: relative;
		border-radius: 8px;
		animation: pulse 2s infinite;
		box-shadow: 0 0 0 rgba(0, 123, 255, 0.7);
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
		}
	}
</style>
