<script lang="ts">
	import { portal } from "#lib/features/portal/portalAction.js";

	export let target: HTMLElement | string = "body";
</script>

<div use:portal={target} hidden>
	<slot />
</div>
