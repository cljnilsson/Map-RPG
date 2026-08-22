export const themeOptions = [
	{ value: "parchment", label: "Parchment" },
	{ value: "dark", label: "Dark" },
	{ value: "forest", label: "Forest" },
	{ value: "ocean", label: "Ocean" },
	{ value: "royal", label: "Royal" },
] as const;

export type ThemeName = (typeof themeOptions)[number]["value"];

export const defaultTheme: ThemeName = "parchment";

export function isThemeName(value: string): value is ThemeName {
	return themeOptions.some((theme) => theme.value === value);
}