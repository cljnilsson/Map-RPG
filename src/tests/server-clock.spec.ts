import { afterEach, describe, expect, it, vi } from "vitest";

describe("server resource clock", () => {
	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.resetModules();
	});

	it("publishes a live update every five seconds", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

		const { createLiveClock } = await import("#lib/server/liveClock.js");
		const clock = createLiveClock();
		const updates = clock.updates();

		expect((await updates.next()).value.data).toBe(0);

		let receivedUpdate = false;
		const nextUpdate = updates.next().then((update) => {
			receivedUpdate = true;
			return update;
		});
		await vi.advanceTimersByTimeAsync(4_999);
		expect(receivedUpdate).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		expect((await nextUpdate).value.data).toBe(1);

		clock.stop();
	});
});