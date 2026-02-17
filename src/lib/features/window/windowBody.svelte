<script lang="ts">
let { children } = $props();
</script>

<div class="row flex-grow-1">
    <div class="col">
        {@render children()}
    </div>
</div>
