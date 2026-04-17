<script lang="ts" generics="T">
    let {
        text,
        options,
        onclick,
    }: {
        text: string;
        options: { val: T; text: string }[];
        onclick: (v: T) => void;
    } = $props();
</script>

<div class="dropdown">
    <button
        class="btn btn-sm btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
    >
        {text}
    </button>
    <ul class="dropdown-menu">
        {#each options as o}
            <button
                type="button"
                class="dropdown-item"
                onclick={() => onclick(o.val)}
            >
                {o.text}
            </button>
        {/each}
    </ul>
</div>

<style>
</style>
