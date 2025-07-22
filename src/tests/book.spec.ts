import { render } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookComponent from "$lib/features/book/book.svelte";
import BookStore from "$lib/stores/book.svelte";

vi.mock("$lib/stores/book.svelte", () => {
	let visible = false;
	let currentPage = 0;
	let currentBook: string[] = [];

	return {
		default: {
			get visible() {
				return visible;
			},
			set visible(v: boolean) {
				visible = v;
			},
			get currentPage() {
				return currentPage;
			},
			set currentPage(v: number) {
				currentPage = v;
			},
			get currentBook() {
				return currentBook;
			},
			set currentBook(v: string[]) {
				currentBook = v;
			}
		}
	};
});

describe("BookComponent", () => {
	beforeEach(() => {
		BookStore.visible = false;
		BookStore.currentPage = 0;
		BookStore.currentBook = [];
	});

	it("does not render when not visible", () => {
		BookStore.visible = false;
		BookStore.currentBook = ["<p>Hidden Page</p>"];
		const { container } = render(BookComponent);
	
		expect(container.querySelector(".book")).toBeNull();
	});

	it("renders one BookPage when currentBook has one page", async () => {
		BookStore.visible = true;
		BookStore.currentBook = ["<p>Page 1</p>"];
		const { getByText, queryAllByText } = render(BookComponent);

		expect(getByText("Page 1")).toBeInTheDocument();
		expect(queryAllByText("Page 1")).toHaveLength(1);
	});

	it("renders two BookPages when currentBook has more than one page", async () => {
		BookStore.visible = true;
		BookStore.currentBook = ["<p>Page 1</p>", "<p>Page 2</p>"];
		const { getByText } = render(BookComponent);

		expect(getByText("Page 1")).toBeInTheDocument();
		expect(getByText("Page 2")).toBeInTheDocument();
	});
});
