import { query } from "$app/server";

const sleep = (ms: number) => new Promise((f) => setTimeout(f, ms));

export const now = query.live(async function* () {
	while (true) {
		yield new Date();
		await sleep(1000);
	}
});