const INTERVAL_SECONDS = 5;

type ServerPing = {
	timestamp: number;
	nextUpdate: number;
	msUntilNextUpdate: number;
	data: number;
};

type Subscriber = (value: ServerPing) => void;

export function createLiveClock(intervalSeconds = INTERVAL_SECONDS) {
	let counter = 0;
	let lastUpdate = Date.now();
	let nextUpdate = lastUpdate + intervalSeconds * 1000;
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
		lastUpdate = Date.now();
		nextUpdate = lastUpdate + intervalSeconds * 1000;

		console.log(counter);

		broadcast({
			data: counter,
			timestamp: lastUpdate,
			nextUpdate,
			msUntilNextUpdate: intervalSeconds * 1000,
		});
	}, intervalSeconds * 1000);

	async function* updates(): AsyncGenerator<ServerPing> {
		yield {
			data: counter,
			timestamp: Date.now(),
			nextUpdate,
			msUntilNextUpdate: Math.max(0, nextUpdate - Date.now()),
		};

		while (true) {
			yield await waitForNextPing();
		}
	}

	function stop() {
		clearInterval(timer);
		subscribers.clear();
	}

	return { updates, stop };
}