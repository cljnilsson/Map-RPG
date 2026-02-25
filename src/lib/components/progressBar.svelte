<script lang="ts">
    let {min = 0, max = 100, val, text, color}: {min?: number, max?: number, val: number, text: string, color: string} = $props();
</script>

<div
	class="progress mt-2"
	role="progressbar"
	aria-label="Character XP bar"
	aria-valuenow={val}
	aria-valuemin={min}
	aria-valuemax={max}
>
	<div class="progress-bar {color}" style="width: {val * 100}%">
	</div>

	<span class="text-center w-100">
	    {text}
    </span>
</div>

<style>
	.bg-purple {
		background-color: rgb(173, 51, 255);
	}
</style>
