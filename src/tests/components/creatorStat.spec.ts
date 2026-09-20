import { expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";
import CreatorStat from "#lib/features/creator/creatorStat.svelte";

const props = { name: "Intelligence", min: 6, max: 9, stat: 6, total: 0, totalMax: 3, totalLeft: 3 };

test("compact dark controls use intrinsic widths and light outlines", () => {
	render(CreatorStat, { ...props, size: "sm", darkMode: true });
	const increase = screen.getByRole("button", { name: "Increase Intelligence" });
	expect(increase).toHaveClass("btn-sm", "btn-outline-light");
	expect(increase.parentElement).toHaveClass("col-auto", "flex-nowrap");
	expect(screen.getByText("Intelligence").parentElement).toHaveClass("text-light", "flex-nowrap");
});

test("appearance and size can be changed independently", async () => {
	const { rerender } = render(CreatorStat, props);
	const increase = screen.getByRole("button", { name: "Increase Intelligence" });
	expect(increase).toHaveClass("btn-outline-dark");
	expect(increase).not.toHaveClass("btn-sm", "btn-lg");
	await rerender({ ...props, size: "lg", darkMode: true });
	expect(increase).toHaveClass("btn-lg", "btn-outline-light");
	await rerender({ ...props, size: "sm", darkMode: false });
	expect(increase).toHaveClass("btn-sm", "btn-outline-dark");
});