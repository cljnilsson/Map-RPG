import { expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/svelte";
import Window from "$lib/features/window/window.svelte";
import { fireEvent } from "@testing-library/svelte";

const renderOptions = {
	width: 400,
	height: 600,
	x: 10,
	y: 10,
	toggleKey: "x",
	visibility: true,
	uniqueKey: "test-window",
};

test("Window renders", async () => {
	const { component, container } = render(Window, renderOptions);

	expect(component).toBeTruthy();
	expect(container).toMatchSnapshot();
});

test("Window closes by click", async () => {
	const user = userEvent.setup();

	render(Window, renderOptions);

	const buttons = screen.getAllByRole("button");

	expect(buttons[0]).toBeVisible();

	await user.click(buttons[3]); // Close button
	//await fireEvent.click(buttons[3]);

	expect(buttons[0].closest(".overlay-rect")).not.toBeVisible();
});

test("Window closes by keybind", async () => {
	//const user = userEvent.setup();

	render(Window, renderOptions);

	const buttons = screen.getAllByRole("button");

	expect(buttons[0]).toBeVisible();

	// user.keyboard adds 100~ms to the test so using fireEvent instead for now

	//await user.keyboard("y");
	await fireEvent.keyDown(document.body, { key: "y" });

	expect(buttons[0].closest(".overlay-rect")).toBeVisible();

	//await user.keyboard("x");
	await fireEvent.keyDown(document.body, { key: "x" });

	expect(buttons[0].closest(".overlay-rect")).not.toBeVisible();
});
