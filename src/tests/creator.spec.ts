import { expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Creator from "$lib/features/creator/creator.svelte";

test("Creator renders with correct elements", () => {
	render(Creator);

	// Check main heading
	expect(screen.getByText(/Create your character!/i)).toBeInTheDocument();

	// Check tab buttons
	expect(screen.getByRole("button", { name: /Character/i })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: /Class/i })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: /Faith/i })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: /Image/i })).toBeInTheDocument();

	// Check Create button (disabled)
	const createBtn = screen.getByRole("button", { name: /Create!/i });
	expect(createBtn).toBeInTheDocument();
	expect(createBtn).toBeDisabled();
});

test("Stat '+' buttons are disabled when no points are left", () => {
	render(Creator);

	const plusButtons = screen.getAllByRole("button", { name: "+" });
	expect(plusButtons.length).toBe(5); // One for each stat
	plusButtons.forEach((btn) => expect(btn).toBeDisabled());
});

test("Stat '-' buttons are enabled and work", async () => {
	render(Creator);

	const minusButtons = screen.getAllByRole("button", { name: "-" });
	expect(minusButtons.length).toBe(5);

	// Get the "Vit" row and its current value
	const vitRow = screen.getByText("Vit").closest(".row")!;
	const valueDiv = vitRow.querySelector(".col-auto")!;
	const initialValue = Number(valueDiv.textContent);

	await fireEvent.click(minusButtons[3]); // Decrease Vit
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
