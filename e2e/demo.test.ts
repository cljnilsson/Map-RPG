import { expect, test } from "@playwright/test";

const routes = [
	{ path: "/", heading: "Welcome!" },
	{ path: "/login", heading: "Login" },
	{ path: "/register", heading: "Register Account" },
	{ path: "/creator", heading: "Create your character!" },
	{ path: "/wiki", heading: "Wiki" },
	{ path: "/map", heading: "Login", expectedPath: "/login" },
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
