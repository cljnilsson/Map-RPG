import { query } from "$app/server";
import { createLiveClock } from "$lib/server/liveClock";

const clock = createLiveClock();

export const now = query.live(clock.updates);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		clock.stop();
	});
}