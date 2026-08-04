<script lang="ts">
    let {
        extraClasses,
        icon,
        label,
        onClick,
    }: {
        extraClasses: string;
        icon: string;
        label: string;
        onClick: () => void;
    } = $props();
</script>

<button
    type="button"
    onclick={onClick}
    class={`btn btn-primary btn-sm ${extraClasses}`}
    aria-label={label}
>
    <img src={icon} alt="" aria-hidden="true" class="iconSecondary" />
</button>
