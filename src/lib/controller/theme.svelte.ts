import { defaultTheme, isThemeName, type ThemeName } from "#lib/themes.js";

const storageKey = "map-rpg-theme";
const isBrowser = typeof window !== "undefined";

class ThemeController {
	private _theme = $state<ThemeName>(defaultTheme);

	get theme(): ThemeName {
		return this._theme;
	}

	set theme(value: ThemeName) {
		this._theme = value;
		this.apply();

		if (isBrowser) {
			localStorage.setItem(storageKey, value);
		}
	}

	initialize() {
		if (!isBrowser) {
			return;
		}

		const storedTheme = localStorage.getItem(storageKey);
		this._theme = storedTheme && isThemeName(storedTheme) ? storedTheme : defaultTheme;
		this.apply();
	}

	private apply() {
		if (isBrowser) {
			document.documentElement.dataset.bsTheme = this._theme;
		}
	}
}

export default new ThemeController();