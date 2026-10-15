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
        background-color: var(--bs-tertiary-bg);
        color: var(--bs-emphasis-color);
        border-bottom: 1px solid var(--bs-border-color);
    }

    .wrapper :global(.btn-outline-secondary) {
        --bs-btn-color: var(--bs-body-color);
        --bs-btn-border-color: var(--bs-border-color);
        --bs-btn-hover-color: var(--theme-primary-contrast);
        --bs-btn-hover-bg: var(--bs-primary);
        --bs-btn-hover-border-color: var(--bs-primary);
        --bs-btn-active-color: var(--theme-primary-contrast);
        --bs-btn-active-bg: var(--bs-primary);
        --bs-btn-active-border-color: var(--bs-primary);
    }
</style>
