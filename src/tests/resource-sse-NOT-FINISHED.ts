import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";
import * as serverModule from "$routes/api/resources/+server";
import { produce } from "sveltekit-sse";
/* drizzle mock is currently bugged, revisit these tests once fixed */

// Mock SSE produce
vi.mock("sveltekit-sse", () => ({
	produce: vi.fn((fn) => fn({ emit: vi.fn() })),
}));

// --- Helpers ---
function createMockEvent(): RequestEvent<object, "/api/resources"> {
	return {
		request: new Request("http://localhost/api/resources", { method: "POST" }),
		url: new URL("http://localhost/api/resources"),
		params: {},
		locals: {},
		platform: {},
		route: { id: "/api/resources" },
		cookies: { get: () => undefined, set: () => {}, delete: () => {} },
		isDataRequest: false,
		getClientAddress: () => "127.0.0.1",
		setHeaders: () => {},
	} as unknown as RequestEvent<object, "/api/resources">;
}

describe("+server POST SSE", () => {
	/*it("sets up SSE connection", async () => {
		let connection;
		(produce as Mock).mockImplementationOnce(async (fn) => {
			connection = { emit: vi.fn() };
			await fn(connection as any);
			return vi.fn();
		});

		await serverModule.POST(createMockEvent());

		expect(produce).toHaveBeenCalled();
		expect(serverModule._getConnections().size).toBe(1);
	});*/
	/*it("runs the resource loop and emits messages", async () => {
		let connection;
		(produce as Mock).mockImplementationOnce(async (fn) => {
			connection = { emit: vi.fn() };
			await fn(connection as any);
			return vi.fn();
		});

		await serverModule.POST(createMockEvent());

		// Just check that emit was called — we don’t care about DB values
		expect(connection?.emit).toHaveBeenCalled();
	});*/
	/*
	it("cleans up on disconnect", async () => {
		let connection;
		(produce as Mock).mockImplementationOnce(async (fn) => {
			connection = { emit: vi.fn() };
			await fn(connection as any);
			return vi.fn();
		});

		await serverModule.POST(createMockEvent());

		const [active] = Array.from(serverModule._getConnections());
		expect(serverModule._getConnections().size).toBe(1);

		serverModule._getConnections().delete(active);
		expect(serverModule._getConnections().size).toBe(0);
	});*/
});