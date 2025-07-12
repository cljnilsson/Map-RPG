import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/svelte";

import Window from "$lib/features/window/window.svelte";

const renderOptions = {
	width: 400,
	height: 600,
	x: 10,
	y: 10,
	toggleKey: "x",
	visibility: true
};

test("Window renders", async () => {
	const { component } = render(Window, renderOptions);

	expect(component).toBeTruthy();

	const buttons = screen.getAllByRole("button");
	// 4 because 3 'buttons' and the title bar is also a 'button' for dragging
	expect(buttons.length).toEqual(4);
});

test("Window closes by click", async () => {
	const user = userEvent.setup();
	
	render(Window, renderOptions);

	const buttons = screen.getAllByRole("button");

	expect(buttons[0]).toBeVisible();

	await user.click(buttons[3]); // Close button

	expect(buttons[0].closest(".overlay-rect")).not.toBeVisible();
});

test("Window closes by keybind", async () => {
	const user = userEvent.setup();
	
	render(Window, renderOptions);

	const buttons = screen.getAllByRole("button");

	expect(buttons[0]).toBeVisible();

	await user.keyboard("y");

	expect(buttons[0].closest(".overlay-rect")).toBeVisible();

	await user.keyboard("x");

	expect(buttons[0].closest(".overlay-rect")).not.toBeVisible();
});
