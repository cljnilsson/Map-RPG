<script lang="ts">
    let {children} = $props();
</script>

<div class="row">
    <div class="col">
        {@render children()}
    </div>
</div>