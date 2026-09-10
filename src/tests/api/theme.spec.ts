import { describe, expect, it, vi } from "vitest";
import { POST } from "#routes/api/theme/+server.js";

function createCookies() {
	return { set: vi.fn() };
}

describe("POST /api/theme", () => {
	it("persists a valid theme in a cookie", async () => {
		const cookies = createCookies();
		const response = await POST({
			cookies,
			request: new Request("http://localhost/api/theme", {
				method: "POST",
				body: JSON.stringify({ theme: "royal" }),
			}),
		} as never);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ theme: "royal" });
		expect(cookies.set).toHaveBeenCalledWith("map-rpg-theme", "royal", expect.objectContaining({ httpOnly: true, path: "/" }));
	});

	it("rejects an unsupported theme", async () => {
		const cookies = createCookies();
		const response = await POST({
			cookies,
			request: new Request("http://localhost/api/theme", {
				method: "POST",
				body: JSON.stringify({ theme: "invalid" }),
			}),
		} as never);

		expect(response.status).toBe(400);
		expect(cookies.set).not.toHaveBeenCalled();
	});
});