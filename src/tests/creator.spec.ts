import { expect, test, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Creator from "$lib/features/creator/creator.svelte";
import CreatorStat from "$lib/features/creator/creatorStat.svelte";

test("Creator renders with correct elements", () => {
	const { container } = render(Creator);
	expect(container).toMatchSnapshot();
});

test("Stat '+' buttons are disabled when no points are left", () => {
	const min: number = 3;
	const max: number = 20;
	const totalMax: number = 30;

	render(CreatorStat, {
		props: {
			min,
			max,
			total: 15,
			totalMax,
			stat: 7,
			name: "Vit",
			totalLeft: 0,
		},
	});

	const plusButtons = screen.getAllByRole("button", { name: "+" });
	expect(plusButtons.length).toBe(1); // One for each stat
	plusButtons.forEach((btn) => expect(btn).toBeDisabled());
});

test("Stat '-' buttons are enabled and work", async () => {
	const min: number = 3;
	const max: number = 20;
	const totalMax: number = 30;

	render(CreatorStat, {
		props: {
			min,
			max,
			total: 15,
			totalMax,
			stat: 7,
			name: "Vit",
			totalLeft: 0,
		},
	});

	const minusButtons = screen.getAllByRole("button", { name: "-" });
	expect(minusButtons.length).toBe(1);

	// Get the "Vit" row and its current value
	const vitRow = screen.getByText("Vit").closest(".row")!;
	const valueDiv = vitRow.querySelector(".col-auto")!;
	const initialValue = Number(valueDiv.textContent);

	await fireEvent.click(minusButtons[0]); // Decrease Vit
	const newValue = Number(valueDiv.textContent);

	expect(newValue).toBeLessThan(initialValue);
});

test("Input fields for Name and Age are editable", async () => {
	render(Creator);
	const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
	const ageInput = screen.getByPlaceholderText("Age") as HTMLInputElement;

	await fireEvent.input(nameInput, { target: { value: "Hero123" } });
	await fireEvent.input(ageInput, { target: { value: "27" } });

	expect(nameInput.value).toBe("Hero123");
	expect(ageInput.value).toBe("27");
});

test("Character tab is selected by default", () => {
	render(Creator);
	const characterTab = screen.getByRole("button", { name: "Character" });
	expect(characterTab.className).toContain("activeSelection");
});