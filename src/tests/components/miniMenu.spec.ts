import { beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import MiniMenu from "#lib/features/miniMenu/miniMenu.svelte";
import SkillPoints from "#lib/features/window/windows/skillPoints/skillPoints.svelte";
import WindowController from "#lib/controller/window.svelte.js";

const player = vi.hoisted(() => ({
	level: 12,
	unspentSkillPoints: 0,
	imagePath: "/char.jpg",
	health: 50,
	maxHealth: 100,
	xp: 10,
	stats: { str: 6, int: 6, vit: 6, char: 6, dex: 6 },
	race: "Human",
	age: 22,
	gender: "Female",
	conditions: [],
	allocateSkillPoints: vi.fn(),
}));
vi.mock("#lib/controller/character.svelte.js", () => ({ PlayerController: player }));
vi.mock("#lib/controller/dialogue.svelte.js", () => ({ default: { inDialogue: false } }));
vi.mock("#lib/controller/save.svelte.js", () => ({ default: { saveWindows: vi.fn() } }));

beforeEach(() => {
	player.unspentSkillPoints = 0;
	player.allocateSkillPoints.mockReset();
	WindowController.getByName("SkillPoints").visible = false;
});

test("shows the level on the avatar and hides the skill action with zero points", () => {
	render(MiniMenu);
	expect(screen.getByText("12")).toBeVisible();
	expect(screen.queryByRole("button", { name: /unspent skill points/ })).toBeNull();
});

test("toggles the allocation window without spending points", async () => {
	player.unspentSkillPoints = 3;
	render(MiniMenu);
	render(SkillPoints);
	await fireEvent.click(screen.getByRole("button", { name: "Spend 3 unspent skill points" }));
	expect(await screen.findByRole("button", { name: "Save points" })).toBeVisible();
	expect(WindowController.getByName("SkillPoints").visible).toBe(true);
	await fireEvent.click(screen.getByRole("button", { name: "Spend 3 unspent skill points" }));
	expect(WindowController.getByName("SkillPoints").visible).toBe(false);
	await fireEvent.click(screen.getByRole("button", { name: "Spend 3 unspent skill points" }));
	await fireEvent.click(screen.getByRole("button", { name: /^Close$/ }));
	expect(WindowController.getByName("SkillPoints").visible).toBe(false);
	expect(player.unspentSkillPoints).toBe(3);
});

test("limits allocations to available points and saves only the chosen increases", async () => {
	player.unspentSkillPoints = 3;
	WindowController.getByName("SkillPoints").visible = true;
	render(SkillPoints);
	expect(screen.getByRole("button", { name: "Decrease Strength" })).toBeDisabled();
	expect(screen.getByRole("button", { name: "Save points" })).toBeDisabled();
	for (let i = 0; i < 3; i++) await fireEvent.click(screen.getByRole("button", { name: "Increase Strength" }));
	expect(screen.getByRole("button", { name: "Increase Dexterity" })).toBeDisabled();
	await fireEvent.click(screen.getByRole("button", { name: "Decrease Strength" }));
	await fireEvent.click(screen.getByRole("button", { name: "Increase Dexterity" }));
	await fireEvent.click(screen.getByRole("button", { name: "Save points" }));
	expect(player.allocateSkillPoints).toHaveBeenCalledWith({ str: 2, dex: 1, int: 0, vit: 0, char: 0 });
	expect(WindowController.getByName("SkillPoints").visible).toBe(false);
});

test.each(["toggle", "close"])("discards unsaved allocations when closed via %s", async (method) => {
	player.unspentSkillPoints = 3;
	render(MiniMenu);
	render(SkillPoints);
	const toggle = screen.getByRole("button", { name: "Spend 3 unspent skill points" });
	await fireEvent.click(toggle);
	await fireEvent.click(screen.getByRole("button", { name: "Increase Strength" }));
	await fireEvent.click(method === "toggle" ? toggle : screen.getByRole("button", { name: /^Close$/ }));
	await fireEvent.click(toggle);
	expect(screen.getByRole("button", { name: "Save points" })).toBeDisabled();
	expect(screen.getByRole("button", { name: "Revert" })).toBeDisabled();
	expect(screen.getByRole("button", { name: "Decrease Strength" })).toBeDisabled();
	expect(player.allocateSkillPoints).not.toHaveBeenCalled();
});

test("reverts pending allocations without saving or closing the window", async () => {
	player.unspentSkillPoints = 3;
	WindowController.getByName("SkillPoints").visible = true;
	render(SkillPoints);
	const revert = screen.getByRole("button", { name: "Revert" });
	expect(revert).toBeDisabled();
	await fireEvent.click(screen.getByRole("button", { name: "Increase Strength" }));
	await fireEvent.click(screen.getByRole("button", { name: "Increase Dexterity" }));
	expect(revert).toBeEnabled();
	await fireEvent.click(revert);
	expect(revert).toBeDisabled();
	expect(screen.getByRole("button", { name: "Save points" })).toBeDisabled();
	expect(screen.getByRole("button", { name: "Decrease Strength" })).toBeDisabled();
	expect(screen.getByRole("button", { name: "Decrease Dexterity" })).toBeDisabled();
	expect(screen.getByText(/Points remaining/)).toHaveTextContent("Points remaining: 3");
	expect(WindowController.getByName("SkillPoints").visible).toBe(true);
	expect(player.allocateSkillPoints).not.toHaveBeenCalled();
});

test("keeps the draft and shows an error when saving fails", async () => {
	player.unspentSkillPoints = 3;
	player.allocateSkillPoints.mockRejectedValueOnce(new Error("Offline"));
	WindowController.getByName("SkillPoints").visible = true;
	render(SkillPoints);
	await fireEvent.click(screen.getByRole("button", { name: "Increase Strength" }));
	await fireEvent.click(screen.getByRole("button", { name: "Save points" }));
	expect(await screen.findByRole("alert")).toHaveTextContent("Could not save");
	expect(WindowController.getByName("SkillPoints").visible).toBe(true);
	expect(player.unspentSkillPoints).toBe(3);
});