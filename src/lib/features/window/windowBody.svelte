<script lang="ts">
    let {children} = $props();
</script>

<div class="row h-100">
    <div class="col">
        {@render children()}
    </div>
</div>