import { browser } from "$app/env";
import { defaultTheme, isThemeName, type ThemeName } from "#lib/themes.js";

function initialTheme(): ThemeName {
	if (!browser) {
		return defaultTheme;
	}

	const documentTheme = document.documentElement.dataset.bsTheme;
	return documentTheme && isThemeName(documentTheme) ? documentTheme : defaultTheme;
}

class ThemeController {
	private _theme = $state<ThemeName>(initialTheme());

	get theme(): ThemeName {
		return this._theme;
	}

	async save(value: ThemeName): Promise<boolean> {
		if (!browser) {
			return false;
		}

		try {
			const response = await fetch("/api/theme", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ theme: value }),
			});

			if (!response.ok) {
				return false;
			}

			this._theme = value;
			this.apply();
			return true;
		} catch {
			return false;
		}
	}

	private apply() {
		if (browser) {
			document.documentElement.dataset.bsTheme = this._theme;
		}
	}
}

export default new ThemeController();