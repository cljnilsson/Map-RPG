import { auth } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
//import type { RequestEvent } from "./$types";
import type { RequestEvent } from "@sveltejs/kit";

export async function handle({
  event,
  resolve,
}: {
  event: RequestEvent;
  resolve: (event: RequestEvent) => Response | Promise<Response>;
}): Promise<Response> {
  return svelteKitHandler({ event, resolve, auth, building });
}
