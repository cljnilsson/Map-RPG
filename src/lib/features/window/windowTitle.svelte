<script lang="ts">
    let {children} = $props();
</script>

<div class="row wrapper">
    <div class="col">
        {@render children()}
    </div>
</div>

<style>
    .wrapper {
        background-color: rgba(0, 0, 0, 0.2);
        color: white;
    }
</style>