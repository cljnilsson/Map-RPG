<script lang="ts">
	import { authClient } from "#lib/auth-client.js";
	import PlayerStore from "#lib/stores/character.svelte.js";
	import WindowController from "#lib/controller/window.svelte.js";
	import QuestController from "#lib/controller/quest.svelte.js";
	import InventoryWindow from "#lib/features/window/windows/inventory/inventory.svelte";
	import QuestWindow from "#lib/features/window/windows/quest/quest.svelte";
	import LogWindow from "#lib/features/window/windows/logger/logger.svelte";
	import SkillPointsWindow from "#lib/features/window/windows/skillPoints/skillPoints.svelte";
	import GameWindows from "#lib/partials/gamewindows.svelte";
	import { resolve } from "$app/paths";
	import { getXPForLevel } from "#lib/utils/xp.js";

	let { location }: { location: string } = $props();
	const session = authClient.useSession();
	const character = $derived($session.data?.user ? PlayerStore.character : null);
	const activeQuests = $derived(QuestController.quests.filter((quest) => quest.status === "active").length);
	let showCharacter = $state(false);
	const actions = [
		{ key: "Inventory", label: "Inventory", icon: "backpack" },
		{ key: "Quests", label: "Quests", icon: "journal-bookmark" },
		{ key: "SkillPoints", label: "Skills", icon: "stars" },
		{ key: "Logger", label: "Activity", icon: "chat-left-text" },
	] as const;

	function toggle(key: typeof actions[number]["key"]) {
		const window = WindowController.getByName(key);
		window.visible = !window.visible;
	}
</script>

<div class="game-hud">
	{#if character}
		{#if showCharacter}
			<section class="character-sheet" aria-label="Character details">
				<div class="d-flex justify-content-between align-items-center"><h2>{character.name}</h2><button type="button" class="hud-button" aria-label="Close character details" onclick={() => { showCharacter = false; }}><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
				<p>{character.race} · {character.class} · Level {character.level}</p>
				<dl class="stats-grid">
					{#each [{ name: "Strength", value: character.stats.str }, { name: "Dexterity", value: character.stats.dex }, { name: "Intelligence", value: character.stats.int }, { name: "Vitality", value: character.stats.vit }, { name: "Charisma", value: character.stats.char }] as stat (stat.name)}
						<div><dt>{stat.name}</dt><dd>{stat.value}</dd></div>
					{/each}
				</dl>
				<label class="xp-label" for="atlas-xp">Experience <span>{character.xp} / {getXPForLevel(character.level + 1)}</span></label>
				<progress id="atlas-xp" value={character.xp} max={getXPForLevel(character.level + 1)}></progress>
				<p class="mb-0">{character.conditions.length ? character.conditions.join(", ") : "No active conditions"}</p>
			</section>
		{/if}
		<div class="hud-bar">
			<button type="button" class="portrait" aria-label="Character details" aria-expanded={showCharacter} onclick={() => { showCharacter = !showCharacter; }}>
				{#if character.imagePath}<img src={character.imagePath} alt={character.name} />{:else}<i class="bi bi-person" aria-hidden="true"></i>{/if}
				<span class="level"><span class="visually-hidden">Level </span>{character.level}</span>
			</button>
			<div class="player-vitals">
				<div class="d-flex justify-content-between gap-3"><strong>{character.name}</strong><span>{character.class}</span></div>
				<label for="atlas-health" class="visually-hidden">Health</label>
				<meter id="atlas-health" min="0" max={Math.max(1, character.maxHealth)} value={character.health}></meter>
				<div class="d-flex justify-content-between gap-2"><small>{character.health} / {character.maxHealth} HP</small><small><i class="bi bi-geo-alt" aria-hidden="true"></i> {location}</small></div>
			</div>
			<nav class="action-dock" aria-label="Game tools">
				{#each actions as action (action.key)}
					<button type="button" class="hud-button" class:active={WindowController.getByName(action.key).visible} aria-pressed={WindowController.getByName(action.key).visible} onclick={() => toggle(action.key)}>
						<i class={`bi bi-${action.icon}`} aria-hidden="true"></i><span>{action.label}</span>
						{#if action.key === "SkillPoints" && character.unspentSkillPoints > 0}<span class="count">{character.unspentSkillPoints}<span class="visually-hidden"> unspent skill points</span></span>
						{:else if action.key === "Quests" && activeQuests > 0}<span class="count">{activeQuests}</span>{/if}
					</button>
				{/each}
				<a class="hud-button" href={resolve("settings")}><i class="bi bi-gear" aria-hidden="true"></i><span>Settings</span></a>
			</nav>
			<div class="wallet"><span><i class="coin gold"></i>{character.money.gold}<span class="visually-hidden"> gold</span></span><span><i class="coin silver"></i>{character.money.silver}<span class="visually-hidden"> silver</span></span><span><i class="coin copper"></i>{character.money.copper}<span class="visually-hidden"> copper</span></span></div>
		</div>
	{:else}
		<div class="guest-bar d-flex align-items-center justify-content-between gap-3 flex-wrap"><div><strong><i class="bi bi-compass" aria-hidden="true"></i> Explore as a traveller</strong><p class="mb-0">{$session.data?.user ? "Create a character to use inventory, quests, and skills." : "Sign in to bring your character, inventory, and quests into the atlas."}</p></div><a class="login-button btn" href={$session.data?.user ? resolve("creator") : resolve("login")}>{$session.data?.user ? "Create character" : "Sign in"} <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>
	{/if}
</div>

{#if character}
	<div class="atlas-game-windows">
		<InventoryWindow /><QuestWindow /><LogWindow /><SkillPointsWindow /><GameWindows />
	</div>
{/if}

<style lang="scss">
	.game-hud { position: sticky; bottom: 1rem; z-index: 450; margin-top: 1.2rem; color: #f0e6cd; font-family: system-ui, sans-serif; }
	.hud-bar, .guest-bar, .character-sheet { background: #172b25f5; border: 1px solid #b69b635e; border-radius: 10px; box-shadow: 0 8px 35px #051c1a60; backdrop-filter: blur(14px); }
	.hud-bar { display: flex; align-items: center; gap: 1rem; padding: .8rem 1rem; }
	.portrait { position: relative; width: 60px; height: 60px; flex-shrink: 0; border: 1px solid #ceb786; border-radius: 9px; background: #30483b; color: #e2c99b; padding: 0; img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; } > i { font-size: 2rem; } .level { position: absolute; bottom: -4px; right: -5px; background: #d6bb84; border: 2px solid #172b25; color: #18352a; font-size: .7rem; font-weight: 800; padding: .05rem .4rem; border-radius: 5px; } }
	.player-vitals { flex: 1; min-width: 170px; max-width: 330px; strong { font-size: .9rem; } span, small { font-size: .65rem; color: #bac6b0; } meter { width: 100%; height: 14px; display: block; margin: 3px 0; } meter::-webkit-meter-bar { background: #36443b; border: 0; } meter::-webkit-meter-optimum-value { background: #87a575; } }
	.action-dock { display: flex; gap: .4rem; margin: 0 auto; }
	.hud-button { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .3rem; min-width: 65px; padding: .5rem .7rem; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #c4cbbb; text-decoration: none; font-size: .65rem; > i { font-size: 1.2rem; } &:hover, &.active { color: #eed5a6; border-color: #c8ac715e; background: #ffffff09; } .count { position: absolute; right: 2px; top: 0; background: #d2b277; color: #142b21; border-radius: 20px; font-size: .6rem; font-weight: 800; padding: .08rem .3rem; } }
	.wallet { display: flex; gap: .7rem; font-size: .75rem; font-variant-numeric: tabular-nums; > span { display: flex; align-items: center; gap: .3rem; } .coin { width: 9px; height: 9px; border-radius: 50%; display: inline-block; box-shadow: inset 0 0 0 2px #ffffff25; } .gold { background: #d9b25b; } .silver { background: #b7c4c5; } .copper { background: #bd855c; } }
	.character-sheet { position: absolute; bottom: calc(100% + .7rem); left: 0; padding: 1.3rem; width: min(420px, 100%); max-height: 65dvh; overflow: auto; h2 { font: 1.7rem Georgia, serif; margin: 0; } p { font-size: .75rem; color: #b8c4af; } .hud-button { min-width: 30px; } }
	.stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: .4rem; margin: 1rem 0; div { text-align: center; background: #ffffff06; border: 1px solid #ffffff10; border-radius: 5px; padding: .6rem .2rem; } dt { font-size: .5rem; font-weight: 500; color: #bcc7b3; } dd { margin: .3rem 0 0; font-size: 1.2rem; color: #e1c493; } }
	.xp-label { font-size: .7rem; display: flex; justify-content: space-between; } progress { width: 100%; height: 6px; accent-color: #d0b276; margin: .4rem 0 1rem; }
	.guest-bar { padding: 1rem 1.3rem; strong { font: 1rem Georgia, serif; } p { font-size: .72rem; color: #bbc7b2; margin-top: .3rem; } }
	.login-button { background: #d8bd85; color: #20382c; font-size: .8rem; white-space: nowrap; &:hover { background: #e5cd9c; } }
	.game-hud :is(button, a):focus-visible { outline: 3px solid #e3bf72; outline-offset: 3px; }
	.atlas-game-windows :global(.overlay-rect) { background: #172b25f5; border-color: #a58f615e; box-shadow: 0 15px 60px #0006; backdrop-filter: blur(16px); max-width: calc(100vw - 2rem); }
	.atlas-game-windows :global(.overlay-rect .btn-outline-secondary) { color: #e1d6bd; border-color: #8a957c; }
	@media (max-width: 1000px) { .hud-bar { flex-wrap: wrap; gap: .7rem; } .player-vitals { max-width: none; } .action-dock { order: 3; width: 100%; justify-content: center; border-top: 1px solid #ffffff15; padding-top: .6rem; } }
	@media (max-width: 600px) { .game-hud { bottom: .4rem; } .hud-bar { padding: .65rem; } .portrait { width: 45px; height: 45px; } .wallet { font-size: .6rem; gap: .4rem; } .player-vitals { min-width: 140px; } .hud-button { min-width: 50px; padding: .4rem .55rem; } .guest-bar { padding: .8rem; } .atlas-game-windows :global(.overlay-rect) { left: .5rem !important; top: 5rem !important; width: calc(100vw - 1rem) !important; max-width: none; max-height: calc(100dvh - 6rem); overflow: auto; } }
</style>
