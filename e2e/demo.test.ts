import { expect, test } from "@playwright/test";

const routes = [
	{ path: "/", heading: "Welcome!" },
	{ path: "/login", heading: "Login" },
	{ path: "/register", heading: "Register Account" },
	{ path: "/creator", heading: "Create your character!" },
	{ path: "/wiki", heading: "Wiki" },
	{ path: "/map", heading: "Login", expectedPath: "/login" },
	{ path: "/themetest", heading: "Theme picker" },
];

for (const route of routes) {
	test(`${route.path} renders its primary heading`, async ({ page }) => {
		const response = await page.goto(route.path);

		expect(response?.ok()).toBe(true);
		if (route.expectedPath) {
			await expect(page).toHaveURL(new RegExp(`${route.expectedPath}$`));
		}
		await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
	});
}

test("theme picker applies the selected Bootstrap theme", async ({ page }) => {
	await page.goto("/");

	await page.getByLabel("Theme").selectOption("forest");
	await expect(page.locator("html")).toHaveAttribute("data-bs-theme", "forest");
});

test("visual theme picker applies the selected theme", async ({ page }) => {
	await page.goto("/themetest");

	await page.getByRole("button", { name: "Use Royal theme" }).click();
	await expect(page.locator("html")).toHaveAttribute("data-bs-theme", "royal");
});
