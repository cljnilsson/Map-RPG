import { cleanup, render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginPage from "$routes/login/+page.svelte";
import RegisterPage from "$routes/register/+page.svelte";

const authClientMocks = vi.hoisted(() => ({
	signInEmail: vi.fn(async () => ({ data: null, error: null })),
	signOut: vi.fn(),
	signUpEmail: vi.fn(async () => ({ data: null, error: null })),
}));

vi.mock("#lib/auth-client.js", () => ({
	authClient: {
		signIn: { email: authClientMocks.signInEmail },
		signOut: authClientMocks.signOut,
		signUp: { email: authClientMocks.signUpEmail },
		useSession: () => ({
			subscribe(callback: (value: { data: null }) => void) {
				callback({ data: null });
				return () => {};
			},
		}),
	},
}));

describe("authentication pages", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it("submits login credentials through the auth client", async () => {
		const user = userEvent.setup();
		render(LoginPage);

		await user.type(screen.getByLabelText("Email"), "admin@admin");
		await user.type(screen.getByLabelText("Password"), "admin123");
		await user.click(screen.getByRole("button", { name: "Login" }));

		expect(authClientMocks.signInEmail).toHaveBeenCalledWith(
			{
				email: "admin@admin",
				password: "admin123",
				rememberMe: true,
			},
			expect.objectContaining({
				onError: expect.any(Function),
				onRequest: expect.any(Function),
				onSuccess: expect.any(Function),
			}),
		);
	});

	it("submits registration details through the auth client", async () => {
		const user = userEvent.setup();
		render(RegisterPage);

		await user.type(screen.getByLabelText("Email"), "new-user@example.com");
		await user.type(screen.getByLabelText("Username"), "New User");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.type(screen.getByPlaceholderText("Confirm password"), "password123");
		await user.click(screen.getByRole("button", { name: "Register" }));

		expect(authClientMocks.signUpEmail).toHaveBeenCalledWith(
			{
				email: "new-user@example.com",
				name: "New User",
				password: "password123",
			},
			expect.objectContaining({
				onError: expect.any(Function),
				onRequest: expect.any(Function),
				onSuccess: expect.any(Function),
			}),
		);
	});
});