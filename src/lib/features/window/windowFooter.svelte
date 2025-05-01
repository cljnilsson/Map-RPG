<script lang="ts">
    let {children} = $props();
</script>

<div class="row mt-auto">
    <div class="col">
        {@render children()}
    </div>
</div>