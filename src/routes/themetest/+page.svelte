<script lang="ts">
	import { onMount } from "svelte";
	import ThemeController from "#lib/controller/theme.svelte.js";
	import { themeOptions, type ThemeName } from "#lib/themes.js";

	let selectedTheme = $state<ThemeName>(ThemeController.theme);

	onMount(() => {
		selectedTheme = ThemeController.theme;
	});

	function saveTheme() {
		ThemeController.theme = selectedTheme;
	}
</script>

<svelte:head>
	<title>Theme picker</title>
</svelte:head>

<main class="container page-surface mt-3">
	<div class="mb-4">
		<h1 class="h2">Theme picker</h1>
		<p class="mb-0">Pick a palette, preview it below, then save when you are ready.</p>
	</div>

	<div class="row g-4">
		<div class="col-12 col-lg-5">
			<div class="d-grid gap-2" aria-label="Choose a theme">
				{#each themeOptions as theme (theme.value)}
				<button
					type="button"
					class="theme-preview theme-option d-flex align-items-center gap-3 text-start"
					data-bs-theme={theme.value}
					aria-pressed={selectedTheme === theme.value}
					onclick={() => (selectedTheme = theme.value)}
				>
					<span class="theme-option-name">{theme.label}</span>
					<span class="theme-swatches" aria-hidden="true">
						<span class="theme-swatch theme-swatch-body"></span>
						<span class="theme-swatch theme-swatch-surface"></span>
						<span class="theme-swatch theme-swatch-primary"></span>
						<span class="theme-swatch theme-swatch-border"></span>
						<span class="theme-swatch theme-swatch-text"></span>
					</span>
				</button>
				{/each}
			</div>
		</div>
		<div class="col-12 col-lg-7">
			<div class="theme-preview theme-sample card" data-bs-theme={selectedTheme}>
				<div class="card-body p-4">
					<div class="d-flex align-items-center justify-content-between gap-3 mb-3">
						<div>
							<p class="small text-body-secondary text-uppercase mb-1">Previewing</p>
							<h2 class="h4 mb-0">{themeOptions.find((theme) => theme.value === selectedTheme)?.label}</h2>
						</div>
						<span class="badge text-bg-secondary">Preview</span>
					</div>
					<p class="mb-4">This sample shows the page surface, text, borders, and primary action for the selected palette.</p>
					<div class="theme-preview-panel rounded border p-3">
						<p class="fw-semibold mb-1">A small preview</p>
						<p class="small text-body-secondary mb-3">The theme is not applied to the game until you save it.</p>
						<button type="button" class="btn btn-primary btn-sm">Primary action</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col">
		    <button type="button" class="btn btn-primary" onclick={saveTheme}>Save {themeOptions.find((theme) => theme.value === selectedTheme)?.label} theme</button>
		</div>
	</div>
</main>

<style lang="scss">
	.theme-option {
		padding: 0.65rem 0.75rem;
		color: var(--bs-body-color);
		background: var(--theme-surface);
		border: 1px solid var(--bs-border-color);
		border-radius: var(--bs-border-radius);

		&:focus-visible {
			outline: 3px solid rgb(var(--bs-primary-rgb) / 55%);
			outline-offset: 3px;
		}

		&[aria-pressed="true"] {
			box-shadow: 0 0 0 3px rgb(var(--bs-primary-rgb) / 35%);
		}
	}

	.theme-option-name {
		min-width: 5.5rem;
		font-weight: 600;
	}

	.theme-swatches {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		flex: 1;
		overflow: hidden;
		border: 1px solid var(--bs-border-color);
		border-radius: var(--bs-border-radius-sm);
	}

	.theme-swatch {
		height: 1rem;
	}

	.theme-swatch-body {
		background: var(--bs-body-bg);
	}

	.theme-swatch-surface {
		background: var(--theme-surface);
	}

	.theme-swatch-primary {
		background: var(--bs-primary);
	}

	.theme-swatch-border {
		background: var(--bs-border-color);
	}

	.theme-swatch-text {
		background: var(--bs-body-color);
	}

	.theme-sample {
		color: var(--bs-body-color);
		background: var(--theme-surface);
		border-color: var(--bs-border-color);
	}

	.theme-preview-panel {
		background: var(--bs-tertiary-bg);
		border-color: var(--bs-border-color) !important;
	}
</style>
