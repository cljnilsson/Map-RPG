<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import type { IconProp, IconName } from "@fortawesome/fontawesome-svg-core";

    // Copied from their sourcecode, it's not exported
    type WithPrefix<T extends string> = `fa-${T} fa-${IconName}`;
    let {
        extraClasses,
        icon,
        onClick,
    }: {
        extraClasses: string;
        icon:
            | WithPrefix<"solid">
            | WithPrefix<"regular">
            | WithPrefix<"light">
            | WithPrefix<"thin">
            | WithPrefix<"duotone">
            | WithPrefix<"brands">
            | IconProp;
        onClick: () => void;
    } = $props();
</script>

<button
    type="button"
    onclick={onClick}
    class={`btn btn-primary btn-sm ${extraClasses}`}
>
    <FontAwesomeIcon {icon} class="iconSecondary" />
</button>
