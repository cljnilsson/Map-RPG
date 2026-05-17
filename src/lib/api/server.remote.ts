import { query } from "$app/server";

const INTERVAL_SECONDS = 5;
let lastUpdate = Date.now();
let nextUpdate = lastUpdate + INTERVAL_SECONDS * 1000;

type ServerPing = {
	timestamp: number;
	nextUpdate: number;
	msUntilNextUpdate: number;
	data: number;
};

type Subscriber = (value: ServerPing) => void;

let counter = 0;

const subscribers = new Set<Subscriber>();

function broadcast(payload: ServerPing) {
	for (const subscriber of subscribers) {
		subscriber(payload);
	}
}

function waitForNextPing(): Promise<ServerPing> {
	return new Promise((resolve) => {
		const subscriber: Subscriber = (payload) => {
			subscribers.delete(subscriber);
			resolve(payload);
		};

		subscribers.add(subscriber);
	});
}

const timer = setInterval(() => {
	counter += 1;

	console.log(counter);

	lastUpdate = Date.now();
	nextUpdate = lastUpdate + INTERVAL_SECONDS * 1000;

	broadcast({
		data: counter,
		timestamp: Date.now(),
		nextUpdate,
		msUntilNextUpdate: 1000 * INTERVAL_SECONDS,
	});
}, INTERVAL_SECONDS * 1000);

export const now = query.live(async function* () {
	yield {
		data: counter,
		timestamp: Date.now(),
		nextUpdate,
		msUntilNextUpdate: Math.max(0, nextUpdate - Date.now()),
	};

	while (true) {
		yield await waitForNextPing();
	}
});

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		clearInterval(timer);
		subscribers.clear();
	});
}