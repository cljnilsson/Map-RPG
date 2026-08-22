<script lang="ts">
	import ThemeController from "#lib/controller/theme.svelte.js";
	import { themeOptions, type ThemeName } from "#lib/themes.js";

	function selectTheme(theme: ThemeName) {
		ThemeController.theme = theme;
	}
</script>

<svelte:head>
	<title>Theme picker</title>
</svelte:head>

<main class="container page-surface mt-3">
	<div class="mb-4">
		<h1 class="h2">Theme picker</h1>
		<p class="mb-0">Choose a theme from its color palette. Your choice is applied immediately and remembered for future visits.</p>
	</div>

	<div class="row g-3">
		{#each themeOptions as theme (theme.value)}
			<div class="col-12 col-md-6 col-xl-4">
				<button
					type="button"
					class="theme-preview theme-choice w-100 text-start"
					data-bs-theme={theme.value}
					aria-label={`Use ${theme.label} theme`}
					aria-pressed={ThemeController.theme === theme.value}
					onclick={() => selectTheme(theme.value)}
				>
					<div class="d-flex align-items-center justify-content-between gap-3 mb-3">
						<h2 class="h4 mb-0">{theme.label}</h2>
						{#if ThemeController.theme === theme.value}
							<span class="badge text-bg-primary">Active</span>
						{/if}
					</div>

					<div class="theme-swatches mb-3" aria-hidden="true">
						<span class="theme-swatch theme-swatch-body"></span>
						<span class="theme-swatch theme-swatch-surface"></span>
						<span class="theme-swatch theme-swatch-primary"></span>
						<span class="theme-swatch theme-swatch-border"></span>
						<span class="theme-swatch theme-swatch-text"></span>
					</div>

					<div class="theme-sample card">
						<div class="card-body p-3">
							<p class="fw-semibold mb-1">A small preview</p>
							<p class="small text-body-secondary mb-3">Body, surface, border, text, and action colors.</p>
							<div class="d-flex align-items-center gap-2">
								<span class="btn btn-primary btn-sm">Primary action</span>
								<span class="badge text-bg-secondary">Secondary</span>
							</div>
						</div>
					</div>
				</button>
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	.theme-choice {
		padding: 1rem;
		color: var(--bs-body-color);
		background: var(--theme-surface);
		border: 1px solid var(--bs-border-color);
		border-radius: var(--bs-border-radius);
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;

		&:hover {
			transform: translateY(-2px);
		}

		&:focus-visible {
			outline: 3px solid rgb(var(--bs-primary-rgb) / 55%);
			outline-offset: 3px;
		}

		&[aria-pressed="true"] {
			box-shadow: 0 0 0 3px rgb(var(--bs-primary-rgb) / 35%);
		}
	}

	.theme-swatches {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		overflow: hidden;
		border: 1px solid var(--bs-border-color);
		border-radius: var(--bs-border-radius);
	}

	.theme-swatch {
		height: 2rem;
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
		background: var(--bs-tertiary-bg);
		border-color: var(--bs-border-color);
	}
</style>
