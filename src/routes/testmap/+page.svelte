<script lang="ts">
	import { atlas } from "#lib/data/testmap.js";
	import type { AtlasLocation } from "#lib/types/testmap.js";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import GameHud from "./GameHud.svelte";

	type View = { zoom: number; x: number; y: number; selected: string | null };
	let trail = $state<AtlasLocation[]>([atlas]);
	let views = $state<Record<string, View>>({ [atlas.id]: { zoom: 1, x: 0, y: 0, selected: null } });
	const current = $derived(trail[trail.length - 1]);
	const view = $derived(views[current.id]);
	const selected = $derived(current.children.find((place) => place.id === view.selected));
	const detail = $derived(selected ?? current);
	let visited = $state<string[]>([atlas.id]);
	let labels = $state(true);
	let reducedMotion = $state(false);
	let viewport: HTMLFieldSetElement;
	let viewportWidth = $state(0);
	let viewportHeight = $state(0);
	let dragging = $state(false);
	let drag: { id: number; x: number; y: number; originX: number; originY: number } | null = null;
	let imageError = $state(false);
	let heading: HTMLHeadingElement;

	onMount(() => {
		const media = matchMedia("(prefers-reduced-motion: reduce)");
		reducedMotion = media.matches;
		const update = () => { reducedMotion = media.matches; };
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	});

	function clampPan(x: number, y: number) {
		const maxX = viewportWidth * (view.zoom - 1) / 2;
		const maxY = viewportHeight * (view.zoom - 1) / 2;
		view.x = Math.max(-maxX, Math.min(maxX, x));
		view.y = Math.max(-maxY, Math.min(maxY, y));
	}

	$effect(() => { clampPan(view.x, view.y); });

	function zoomBy(amount: number) {
		view.zoom = Math.max(1, Math.min(3, Math.round((view.zoom + amount) * 100) / 100));
		clampPan(view.x, view.y);
	}

	function fitMap() { view.zoom = 1; view.x = 0; view.y = 0; }

	function enter(place: AtlasLocation) {
		if (!views[place.id]) views[place.id] = { zoom: 1, x: 0, y: 0, selected: null };
		trail = [...trail, place];
		if (!visited.includes(place.id)) visited = [...visited, place.id];
		imageError = false;
		heading?.focus({ preventScroll: true });
	}

	function goTo(index: number) {
		trail = trail.slice(0, index + 1);
		imageError = false;
		heading?.focus({ preventScroll: true });
	}

	function pointerDown(event: PointerEvent) {
		if (event.button !== 0 || (event.target instanceof Element && event.target.closest("button"))) return;
		if (view.zoom <= 1) return;
		viewport.setPointerCapture(event.pointerId);
		drag = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: view.x, originY: view.y };
		dragging = true;
	}

	function pointerMove(event: PointerEvent) {
		if (!drag || event.pointerId !== drag.id) return;
		clampPan(drag.originX + event.clientX - drag.x, drag.originY + event.clientY - drag.y);
	}

	function endDrag() { drag = null; dragging = false; }

</script>

<svelte:head><title>The Atlas · Map navigation experiment</title><meta name="description" content="An isolated, illustrated map-navigation prototype for Map-RPG." /></svelte:head>

<main class="atlas-shell">
	<header class="atlas-header d-flex align-items-center justify-content-between gap-3 flex-wrap">
		<div class="d-flex align-items-center gap-3">
			<div class="brand-mark" aria-hidden="true"><i class="bi bi-compass"></i></div>
			<div><p class="eyebrow mb-1">A world within a world</p><h1>The Atlas<span class="edition"> / exploration study</span></h1></div>
		</div>
		<span class="prototype-badge"><span></span> Navigation prototype</span>
	</header>

	<div class="atlas-workspace">
		<div class="trail-bar d-flex align-items-center gap-3">
			<button class="atlas-button back-button" type="button" disabled={trail.length === 1} onclick={() => goTo(trail.length - 2)} aria-label="Back to parent map"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
			<nav aria-label="Map hierarchy"><ol class="d-flex align-items-center flex-wrap gap-2 m-0 p-0">
				{#each trail as place, index (place.id)}
					<li class="d-flex align-items-center gap-2">
						{#if index > 0}<i class="bi bi-chevron-right" aria-hidden="true"></i>{/if}
						<button type="button" class:current={index === trail.length - 1} aria-current={index === trail.length - 1 ? "location" : undefined} onclick={() => goTo(index)}>{place.name}</button>
					</li>
				{/each}
			</ol></nav>
			<span class="depth-label ms-auto">Layer {String(trail.length).padStart(2, "0")}</span>
		</div>

		<div class="atlas-layout">
			<section class="map-section" aria-label="Interactive map">
				<div class="map-heading d-flex justify-content-between align-items-end gap-2">
					<div><p class="eyebrow mb-1">{current.kind} atlas</p><h2 bind:this={heading} tabindex="-1">{current.name}</h2></div>
					<span class="map-count">{current.children.length ? `${current.children.length} places to explore` : "You have arrived"}</span>
				</div>
				<div class="map-frame">
					<fieldset class="map-viewport" aria-label={`${current.name} map locations`} class:dragging={dragging} class:zoomed={view.zoom > 1} bind:this={viewport} bind:clientWidth={viewportWidth} bind:clientHeight={viewportHeight}
						onpointerdown={pointerDown} onpointermove={pointerMove} onpointerup={endDrag} onpointercancel={endDrag} onlostpointercapture={endDrag}>
						{#key current.id}
							<div class="map-scene" in:fade={{ duration: reducedMotion ? 0 : 240 }} style:transform={`translate(${view.x}px, ${view.y}px) scale(${view.zoom})`}>
								<svg class="map-art" viewBox={current.viewBox ?? "0 0 1536 1024"} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Illustrated map of ${current.name}`}>
									<image href={current.image} width="1536" height="1024" onerror={() => { imageError = true; }} />
								</svg>
								{#each current.children as place (place.id)}
									<button type="button" class="map-pin" class:selected={selected?.id === place.id} style:left={`${place.x}%`} style:top={`${place.y}%`}
										style:transform={`translate(-50%, -50%) scale(${1 / view.zoom})`} aria-label={`Inspect ${place.name}, ${place.kind}`} aria-pressed={selected?.id === place.id}
										onclick={() => { view.selected = place.id; }}>
										<span class="pin-emblem"><i class={`bi bi-${place.icon}`} aria-hidden="true"></i></span>
										<span class="pin-label" class:label-hidden={!labels && selected?.id !== place.id}>{place.name}</span>
										{#if visited.includes(place.id)}<span class="visited-dot" aria-hidden="true"></span>{/if}
									</button>
								{/each}
							</div>
						{/key}
						{#if imageError}<div class="image-error" role="alert">The illustration could not load. You can still explore using the location list.</div>{/if}
					</fieldset>
					<div class="compass" aria-hidden="true"><span>N</span><i class="bi bi-compass"></i></div>
					{#if view.zoom > 1}
						<fieldset class="map-tools pan-tools d-flex gap-1" aria-label="Pan map">
							<button type="button" class="atlas-button" aria-label="Pan west" onclick={() => clampPan(view.x + 60, view.y)}><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
							<button type="button" class="atlas-button" aria-label="Pan north" onclick={() => clampPan(view.x, view.y + 60)}><i class="bi bi-arrow-up" aria-hidden="true"></i></button>
							<button type="button" class="atlas-button" aria-label="Pan south" onclick={() => clampPan(view.x, view.y - 60)}><i class="bi bi-arrow-down" aria-hidden="true"></i></button>
							<button type="button" class="atlas-button" aria-label="Pan east" onclick={() => clampPan(view.x - 60, view.y)}><i class="bi bi-arrow-right" aria-hidden="true"></i></button>
						</fieldset>
					{/if}
					<fieldset class="map-tools d-flex gap-1" aria-label="Map controls">
						<button type="button" class="atlas-button" aria-label="Zoom out" disabled={view.zoom <= 1} onclick={() => zoomBy(-0.25)}><i class="bi bi-dash" aria-hidden="true"></i></button>
						<span class="zoom-value">{Math.round(view.zoom * 100)}%</span>
						<button type="button" class="atlas-button" aria-label="Zoom in" disabled={view.zoom >= 3} onclick={() => zoomBy(0.25)}><i class="bi bi-plus" aria-hidden="true"></i></button>
						<button type="button" class="atlas-button" aria-label="Fit map" onclick={fitMap}><i class="bi bi-arrows-angle-expand" aria-hidden="true"></i></button>
						<button type="button" class="atlas-button" aria-label="Show location labels" aria-pressed={labels} onclick={() => { labels = !labels; }}><i class="bi bi-tag" aria-hidden="true"></i></button>
					</fieldset>
				</div>
				<footer class="map-footer d-flex justify-content-between gap-3 flex-wrap"><span><span class="legend-dot"></span> Discoverable location <span class="legend-dot visited"></span> Visited</span><span>Click to inspect · Zoom, then drag to explore</span></footer>
			</section>

			<aside class="location-panel" aria-label="Location details">
				<div class="detail-art" style:background-image={`linear-gradient(0deg, #182923, transparent), url('${detail.image}')`}><span class="eyebrow">{selected ? "Your next discovery" : "You are exploring"}</span></div>
				<div class="detail-content" aria-live="polite">
					<div class="d-flex align-items-center justify-content-between gap-2"><span class="location-kind"><i class={`bi bi-${detail.icon}`} aria-hidden="true"></i> {detail.kind}</span>{#if selected}<button class="clear-selection" type="button" aria-label="Clear location selection" onclick={() => { view.selected = null; }}>×</button>{/if}</div>
					<h3>{detail.name}</h3><p class="description">{detail.description}</p>
					<div class="features d-flex flex-wrap gap-2">{#each detail.features as feature (feature)}<span>{feature}</span>{/each}</div>
					{#if selected}<button class="enter-button btn w-100" type="button" onclick={() => { if (selected) enter(selected); }}>Explore location <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
					{:else if current.children.length}<p class="selection-hint"><i class="bi bi-cursor" aria-hidden="true"></i> Choose a marker or a place below.</p>
					{:else}<div class="arrival-note"><i class="bi bi-check2-circle" aria-hidden="true"></i> A little world of its own.<small>This is the end of this demo branch. Any location can contain another map.</small></div><button type="button" class="enter-button btn w-100" onclick={() => goTo(trail.length - 2)}>Return to {trail[trail.length - 2]?.name}</button>{/if}
				</div>
				{#if current.children.length}<div class="places-list"><p class="eyebrow">In this area <span>{current.children.length}</span></p>
					{#each current.children as place, index (place.id)}<button type="button" class="place-row" class:active={selected?.id === place.id} aria-pressed={selected?.id === place.id} onclick={() => { view.selected = place.id; }}>
						<span class="place-number">{String(index + 1).padStart(2, "0")}</span><span class="place-name">{place.name}<small>{place.kind}</small></span><i class={`bi bi-${visited.includes(place.id) ? "check2" : "arrow-up-right"}`} aria-hidden="true"></i>
					</button>{/each}
				</div>{/if}
			</aside>
		</div>
	</div>
	<GameHud location={current.name} />
	<footer class="prototype-footer d-flex justify-content-between gap-3 flex-wrap"><span><i class="bi bi-bezier2" aria-hidden="true"></i> Demo geography · City resources and units not connected</span><span>Live character tools · Saved actions affect your character</span></footer>
</main>

<style lang="scss">
	.atlas-shell {
		--ink: #253c35; --muted: #75766a; --paper: #f1ecdf; --gold: #c6a66c;
		max-width: 1680px; margin: 0 auto; padding: 2rem clamp(1rem, 3vw, 3rem); color: var(--ink);
		font-family: system-ui, sans-serif;
		h1, h2, h3 { font-family: "IM Fell English", Georgia, serif; }
		button { transition: background-color 150ms, color 150ms, box-shadow 150ms; }
		button:focus-visible { outline: 3px solid #e1a843; outline-offset: 4px; }
	}
	.atlas-header { margin-bottom: 1.6rem; color: #f5ecd6; text-shadow: 0 1px 5px #142b26; h1 { font-size: 2.5rem; margin: 0; } .eyebrow { color: #e6d4b0; } }
	.brand-mark { font-size: 2.6rem; color: #e4c590; }
	.edition { font: italic 1rem Georgia, serif; color: #e6d4b0; margin-left: .6rem; }
	.eyebrow { font-size: .64rem; text-transform: uppercase; letter-spacing: .18em; font-weight: 700; color: var(--muted); }
	.prototype-badge { font-size: .7rem; background: #142c26df; border: 1px solid #c6a66c60; border-radius: 30px; padding: .6rem 1rem; span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #c6a66c; margin-right: .5rem; } }
	.atlas-workspace { background: var(--paper); border: 1px solid #d1c8b3; border-radius: 12px; box-shadow: 0 24px 70px #08171360; overflow: hidden; }
	.trail-bar { min-height: 65px; padding: .7rem 1.4rem; border-bottom: 1px solid #d8d0bd; background: #e9e3d5; nav button { background: transparent; border: 0; color: #6b7367; font-size: .78rem; padding: .35rem .1rem; &.current { color: #243f34; font-weight: 700; } &:hover { color: #966b29; } } li > i { font-size: .55rem; color: #8d9382; } }
	.depth-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .13em; white-space: nowrap; color: #7e8073; }
	.atlas-button { border: 1px solid transparent; background: transparent; color: inherit; border-radius: 5px; width: 36px; height: 36px; display: inline-grid; place-items: center; flex-shrink: 0; &:hover:not(:disabled) { background: #ffffff25; } &:disabled { opacity: .3; cursor: default; } &[aria-pressed="true"] { color: #edd2a3; background: #ffffff15; } }
	.back-button { border-color: #ccc4af; &:hover:not(:disabled) { background: #fff8; } }
	.atlas-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; }
	.map-section { min-width: 0; padding: 1.5rem; }
	.map-heading { margin-bottom: 1.15rem; h2 { margin: 0; font-size: 2rem; outline: none; } }
	.map-count { font-size: .68rem; color: var(--muted); padding-bottom: .25rem; }
	.map-frame { position: relative; border: 5px solid #ded5bf; outline: 1px solid #c5bca6; border-radius: 3px; background: #d5ceb9; }
	.map-viewport { position: relative; width: 100%; min-width: 0; padding: 0; margin: 0; border: 0; aspect-ratio: 3 / 2; overflow: hidden; isolation: isolate; &.zoomed { cursor: grab; touch-action: none; } &.dragging { cursor: grabbing; } }
	.map-scene { position: absolute; inset: 0; transform-origin: center; }
	.map-art { width: 100%; height: 100%; display: block; user-select: none; pointer-events: none; }
	.map-pin { position: absolute; border: 0; padding: 0; width: 44px; height: 44px; background: transparent; color: #f8eed5; z-index: 2; display: grid; place-items: center;
		.pin-emblem { display: grid; place-items: center; width: 38px; height: 38px; background: #233f36; border: 2px solid #ecd7a8; border-radius: 50%; box-shadow: 0 3px 10px #102b2690, 0 0 0 4px #233f3625; transition: background-color 160ms, box-shadow 160ms; }
		.pin-label { position: absolute; top: 46px; background: #182e27eb; border: 1px solid #dbc28d70; box-shadow: 0 2px 6px #0004; padding: .3rem .65rem; border-radius: 4px; white-space: nowrap; font-size: .72rem; font-weight: 600; pointer-events: none; }
		&:hover, &:focus-visible, &.selected { z-index: 3; .pin-emblem { background: #a57d3d; box-shadow: 0 0 0 6px #f6e2b44d, 0 4px 12px #102b2690; } .pin-label { background: #f4e8ca; color: #2b372b; } }
		.label-hidden { opacity: 0; } &:hover .label-hidden, &:focus-visible .label-hidden { opacity: 1; }
	}
	.visited-dot { position: absolute; right: 1px; top: 1px; width: 10px; height: 10px; border: 2px solid #f1e7cd; background: #93ac78; border-radius: 50%; }
	.compass { position: absolute; top: 14px; right: 18px; color: #efe3bd; text-shadow: 0 2px 4px #122e2a; text-align: center; pointer-events: none; span { display: block; font: .65rem Georgia, serif; } i { font-size: 2.3rem; } }
	.map-tools { position: absolute; bottom: 14px; left: 14px; background: #1c332dee; color: #f4e6c9; border: 1px solid #d4be8860; border-radius: 7px; padding: 3px; box-shadow: 0 4px 14px #0003; .zoom-value { align-self: center; font-size: .68rem; min-width: 36px; text-align: center; font-variant-numeric: tabular-nums; } }
	.map-footer { color: var(--muted); font-size: .62rem; padding-top: 1rem; }
	.map-tools.pan-tools { top: 14px; bottom: auto; }
	.legend-dot { display: inline-block; width: 6px; height: 6px; background: #385849; border-radius: 50%; margin-right: 5px; &.visited { background: #8ba574; margin-left: 12px; } }
	.location-panel { background: #182923; color: #f1e8d4; min-width: 0; }
	.detail-art { height: 130px; background-size: cover; background-position: center 45%; display: flex; align-items: end; padding: 1.4rem 1.5rem .5rem; .eyebrow { color: #dbc291; } }
	.detail-content { padding: .8rem 1.5rem 1.5rem; h3 { font-size: 1.8rem; margin: .65rem 0; } .description { color: #c1c8b9; font-size: .8rem; line-height: 1.8; } }
	.location-kind { font-size: .65rem; color: #d2bb8d; i { margin-right: .3rem; } }
	.clear-selection { color: #ced5c8; border: 0; background: #ffffff0d; border-radius: 50%; width: 28px; height: 28px; }
	.features { span { font-size: .59rem; color: #c4cebd; border: 1px solid #ffffff20; padding: .25rem .5rem; border-radius: 3px; } }
	.enter-button { margin-top: 1.5rem; background: #d8bd85; color: #1c3128; border: 1px solid #e0c68f; font-size: .78rem; padding: .8rem; font-weight: 600; i { margin-left: .8rem; } &:hover { background: #edd5a1; color: #14251d; } }
	.selection-hint { color: #b2bdac; font-size: .7rem; margin: 1.5rem 0 0; i { margin-right: .3rem; } }
	.arrival-note { font-family: Georgia, serif; color: #ddc796; margin-top: 1.8rem; small { font-family: system-ui, sans-serif; display: block; font-size: .72rem; color: #b7c1af; line-height: 1.7; margin-top: .7rem; } }
	.places-list { border-top: 1px solid #ffffff16; padding: 1.3rem 1.5rem; .eyebrow { color: #9ea993; span { float: right; } } }
	.place-row { width: 100%; display: flex; text-align: left; align-items: center; gap: .8rem; background: transparent; color: #e0e6d9; border: 1px solid transparent; border-bottom-color: #ffffff10; padding: .85rem .4rem; border-radius: 3px; &:hover, &.active { background: #ffffff09; border-color: #c9ad7650; } > i { margin-left: auto; color: #b9a273; font-size: .8rem; } }
	.place-number { color: #82927b; font-size: .6rem; }
	.place-name { font-size: .76rem; small { display: block; font-size: .6rem; color: #9eae96; margin-top: .2rem; } }
	.prototype-footer { padding: 1.1rem .2rem 0; font-size: .65rem; color: #f0e4c9; text-shadow: 0 1px 4px #0a201b; i { margin-right: .5rem; } }
	.image-error { position: absolute; inset: 0; display: grid; place-items: center; padding: 2rem; background: #e8dfc7; }
	@media (min-width: 1500px) { .atlas-layout { grid-template-columns: minmax(0, 1fr) 330px; } }
	@media (max-width: 1000px) { .atlas-layout { grid-template-columns: minmax(0, 1fr) 260px; } .map-section { padding: 1rem; } .detail-content, .places-list { padding: 1rem; } .edition, .depth-label { display: none; } }
	@media (max-width: 760px) { .atlas-layout { grid-template-columns: 1fr; } .atlas-header h1 { font-size: 2rem; } .atlas-shell { padding: 1rem .7rem; } .prototype-badge { font-size: .6rem; } .map-heading h2 { font-size: 1.7rem; } .map-count { font-size: .6rem; } .map-section { padding: .8rem; } .trail-bar { padding: .6rem .8rem; } .detail-art { height: 80px; } .map-pin .pin-label { font-size: .6rem; padding: .2rem .35rem; } .map-tools { bottom: 8px; left: 8px; } .compass { top: 8px; right: 8px; } }
	@media (prefers-reduced-motion: reduce) { .atlas-shell button, .map-pin .pin-emblem { transition: none; } }
</style>
