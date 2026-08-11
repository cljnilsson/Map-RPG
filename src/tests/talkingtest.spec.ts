import { cleanup, render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import Dialogue from "$lib/features/dialogue/dialogue.svelte";
import DialogueController from "$lib/controller/dialogue.svelte";
import type { CharSprite, Message } from "$lib/types/message";

const alice: CharSprite = { name: "Alice", image: "alice.png" };
const bob: CharSprite = { name: "Bob", image: "bob.png" };
const you: CharSprite = { name: "You", image: "char.jpg" };

const aliceMessages: Message[] = [
	{ type: "text", text: "Bob just got here.", from: alice, next: 1 },
	{ type: "text", text: "Looks like he is coming over.", from: alice, next: -1 },
];

const conversationMessages: Message[] = [
	{ type: "text", text: "Hello, how are you?", from: alice, next: 1 },
	{ type: "text", text: "I'm good, thanks! How about you?", from: bob, next: 2 },
	{
		type: "choice",
		from: you,
		choices: [
			{ text: "I'm doing well!", next: 3, saveResponse: true },
			{ text: "Pretty busy lately.", next: 4, saveResponse: true },
			{ text: "Could be better.", next: 4, saveResponse: true },
			{ text: "All good here.", next: 4, saveResponse: true },
		],
	},
	{ type: "text", text: "Good to hear", from: bob, next: -1 },
	{ type: "text", text: "I hope things ease up for you soon.", from: bob, next: -1 },
];

function startDialogue(msgs: Message[]) {
	new DialogueController({ msgs, player: you, canClose: true });
}

function clearDialogues() {
	for (const dialogue of [...DialogueController.all]) {
		dialogue.destroy();
	}
}

describe("talking test dialogue", () => {
	afterEach(() => {
		cleanup();
		clearDialogues();
		DialogueController.inDialogue = false;
	});

	it("navigates backward only when a previous message exists and can be restarted", async () => {
		const user = userEvent.setup();
		render(Dialogue);
		startDialogue(aliceMessages);
		await waitFor(() => expect(screen.getByText("Bob just got here.")).toBeInTheDocument());

		expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

		await user.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getByText("Looks like he is coming over.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();

		await user.click(screen.getByRole("button", { name: "Previous" }));
		expect(screen.getByText("Bob just got here.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

		await user.click(screen.getByRole("button", { name: "Next" }));
		await user.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.queryByText("Looks like he is coming over.")).not.toBeInTheDocument();

		startDialogue(aliceMessages);
		await waitFor(() => expect(screen.getByText("Bob just got here.")).toBeInTheDocument());
		expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

		await user.click(screen.getByRole("button", { name: "Leave" }));
		expect(screen.queryByText("Bob just got here.")).not.toBeInTheDocument();
	});

	it("handles every response button and starts each new dialogue at its initial choices", async () => {
		const user = userEvent.setup();
		render(Dialogue);
		startDialogue(conversationMessages);
		await waitFor(() => expect(screen.getByText("Hello, how are you?")).toBeInTheDocument());

		const responses = [
			{ text: "I'm doing well!", reply: "Good to hear" },
			{ text: "Pretty busy lately.", reply: "I hope things ease up for you soon." },
			{ text: "Could be better.", reply: "I hope things ease up for you soon." },
			{ text: "All good here.", reply: "I hope things ease up for you soon." },
		];

		for (const response of responses) {
			await user.click(screen.getByRole("button", { name: "Next" }));
			await user.click(screen.getByRole("button", { name: "Next" }));

			expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
			expect(screen.getByRole("button", { name: response.text })).toBeEnabled();

			await user.click(screen.getByRole("button", { name: response.text }));
			expect(screen.getByText(response.reply)).toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: "Next" }));
			expect(screen.queryByText(response.reply)).not.toBeInTheDocument();

			if (response !== responses.at(-1)) {
				startDialogue(conversationMessages);
				await waitFor(() => expect(screen.getByText("Hello, how are you?")).toBeInTheDocument());
			}
		}
	});
});