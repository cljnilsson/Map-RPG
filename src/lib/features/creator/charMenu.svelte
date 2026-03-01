<script lang="ts">
    let {view = $bindable()}: {view: "character" | "class" | "faith" | "image"} = $props();
</script>

<div class="char-menu">
	<div>
		<button type="button" class="btn" class:activeSelection={view === "character"} onclick={() => (view = "character")}
			><h5>Character</h5></button
		>
	</div>
	<div>
		<button type="button" class="btn" class:activeSelection={view === "class"} onclick={() => (view = "class")}
			><h5>Class</h5></button
		>
	</div>
	<div>
		<button type="button" class="btn" class:activeSelection={view === "faith"} onclick={() => (view = "faith")}
			><h5>Faith</h5></button
		>
	</div>
	<div>
		<button type="button" class="btn" class:activeSelection={view === "image"} onclick={() => (view = "image")}
			><h5>Image</h5></button
		>
	</div>
</div>

<style>
   	.char-menu {
		position: absolute;
		text-align: left;
		.activeSelection {
			color: rgb(88, 167, 250);
			text-decoration: underline;
		}
		.btn {
			&:hover {
				color: rgb(88, 167, 250);
			}
		}
	}
</style>
