import { describe, it, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

import LoggerWindow from "$lib/components/windows/logger/logger.svelte";
import LoggerStore from "$lib/stores/logs.svelte";

describe("Logger", () => {
	it("Works", () => {
		const toAdd = "Unique Demo Message";

		expect(LoggerStore.logs.length).toBe(0);

		LoggerStore.logs = [...LoggerStore.logs, { timestamp: new Date(), message: toAdd, type: "info" }];

		expect(LoggerStore.logs.length).toBe(1);
		expect(LoggerStore.logs[0]?.message).toBe(toAdd);
	});
});

test("Logger renders", async () => {
	const { component } = render(LoggerWindow);
	expect(component).toBeTruthy();

	const nextButton = screen.getByRole("button", { name: /Next/i });
	const prevButton = screen.getByRole("button", { name: /Previous/i });
	expect(nextButton).toBeInTheDocument();
	expect(prevButton).toBeInTheDocument();

	const paragraphs = screen.getAllByRole("paragraph");
	expect(paragraphs.length).toBeGreaterThan(0);
});
