import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationController } from "$lib/controller/notification.svelte";
import NotificationStore from "$lib/stores/notification.svelte";
import LogController from "$lib/controller/logs.svelte";

// Mock the store and log controller
vi.mock("$lib/stores/notification.svelte", () => ({
	default: {
		queue: [],
	},
}));

vi.mock("$lib/controller/logs.svelte", () => {
	return {
		default: {
			newLog: vi.fn(),
		},
	};
});

describe("NotificationController", () => {
	beforeEach(() => {
		NotificationStore.queue = [];
		vi.clearAllMocks();
	});

	it("adds a valid info notification", () => {
		NotificationController.newNotification("Test message");

		expect(NotificationStore.queue).toHaveLength(1);
		expect(NotificationStore.queue[0]).toEqual({
			message: "Test message",
			type: "info",
		});
		expect(LogController.newLog).toHaveBeenCalledWith("[Notification]: Test message.", "info");
	});

	it("adds a valid warning notification", () => {
		NotificationController.newNotification("Warning message", "warning");

		expect(NotificationStore.queue).toHaveLength(1);
		expect(NotificationStore.queue[0]).toEqual({
			message: "Warning message",
			type: "warning",
		});
		expect(LogController.newLog).toHaveBeenCalledWith("[Notification]: Warning message.", "warning");
	});

	it("does not add notification for empty message", () => {
		NotificationController.newNotification("");

		expect(NotificationStore.queue).toHaveLength(0);
		expect(LogController.newLog).not.toHaveBeenCalled();
	});

	it("does not add notification for very long message (>300)", () => {
		const longMessage = "x".repeat(301);
		NotificationController.newNotification(longMessage);

		expect(NotificationStore.queue).toHaveLength(0);
		expect(LogController.newLog).not.toHaveBeenCalled();
	});
});
