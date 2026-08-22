import { describe, expect, it } from "vitest";
import { defaultTheme, isThemeName, themeOptions } from "#lib/themes.js";

describe("themes", () => {
	it("exposes the named theme options", () => {
		expect(themeOptions.map((theme) => theme.value)).toEqual(["parchment", "dark", "forest", "ocean", "royal"]);
		expect(defaultTheme).toBe("parchment");
	});

	it("accepts only supported theme names", () => {
		expect(isThemeName("forest")).toBe(true);
		expect(isThemeName("unknown")).toBe(false);
	});
});