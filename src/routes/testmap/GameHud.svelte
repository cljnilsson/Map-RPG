<script lang="ts">
	import { authClient } from "#lib/auth-client.js";
	import PlayerStore from "#lib/stores/character.svelte.js";
	import MiniMenu from "#lib/features/miniMenu/miniMenu.svelte";
	import IconMenu from "#lib/features/miniMenu/iconMenu.svelte";
	import InventoryWindow from "#lib/features/window/windows/inventory/inventory.svelte";
	import QuestWindow from "#lib/features/window/windows/quest/quest.svelte";
	import LogWindow from "#lib/features/window/windows/logger/logger.svelte";
	import SkillPointsWindow from "#lib/features/window/windows/skillPoints/skillPoints.svelte";
	import GameWindows from "#lib/partials/gamewindows.svelte";
	import { resolve } from "$app/paths";

	const session = authClient.useSession();
	const character = $derived($session.data?.user ? PlayerStore.character : null);
</script>

{#if character}
	<MiniMenu />
	<IconMenu unavailableWindows={{
		Navigator: "Use the atlas markers and breadcrumbs to navigate.",
		Events: "City events are not connected to atlas locations yet.",
		UnitManagement: "Connect this location to an owned city to manage units.",
		Resources: "Connect this location to an owned city to view resources.",
	}} />
	<div class="atlas-game-windows">
		<InventoryWindow /><QuestWindow /><LogWindow /><SkillPointsWindow /><GameWindows />
	</div>
{:else}
	<div class="d-flex justify-content-end mt-3">
		<a class="btn btn-primary" href={$session.data?.user ? resolve("creator") : resolve("login")}>{$session.data?.user ? "Create character" : "Sign in"}</a>
	</div>
{/if}

<style lang="scss">
	.atlas-game-windows :global(.overlay-rect) {
		max-width: calc(100vw - 2rem);
	}
	@media (max-width: 600px) {
		.atlas-game-windows :global(.overlay-rect) {
			left: .5rem !important;
			top: 5rem !important;
			width: calc(100vw - 1rem) !important;
			max-width: none;
			max-height: calc(100dvh - 6rem);
			overflow: auto;
		}
	}
</style>
