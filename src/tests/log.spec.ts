import { describe, it, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

import LoggerWindow from "$lib/features/window/windows/logger/logger.svelte";
import WindowController from "$lib/controller/window.svelte";
import LogsController from "$lib/controller/logs.svelte";

describe("Logger", () => {
	it("Works", () => {
		const toAdd = "Unique Demo Message";

		expect(LogsController.logs.length).toBe(0);

		LogsController.newLogSimple(toAdd, "info");

		expect(LogsController.logs.length).toBe(1);
		expect(LogsController.logs[0]?.message[0].text).toBe(toAdd);
	});
});

test("Logger renders", async () => {
	WindowController.getByName("Logger").visible = true;

	const { component } = render(LoggerWindow);
	expect(component).toBeTruthy();

	const nextButton = screen.getByRole("button", { name: /Next/i });
	const prevButton = screen.getByRole("button", { name: /Previous/i });
	expect(nextButton).toBeInTheDocument();
	expect(prevButton).toBeInTheDocument();

	const paragraphs = screen.getAllByRole("paragraph");
	expect(paragraphs.length).toBeGreaterThan(0);
});