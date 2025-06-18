async function request<T>(url: string, options: RequestInit): Promise<T> {
	const resp = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers
		}
	});

	if (!resp.ok) {
		throw new Error(`${options.method || "GET"} ${url} failed with status ${resp.status}`);
	}

	const body = await resp.json();

	if (typeof body !== "object" || body === null) {
		throw new Error("Response body does not match the expected type.");
	}

	return body as T;
}

export function getRequest<T>(url: string): Promise<T> {
	return request<T>(url, { method: "GET" });
}

export function postRequest<T, U>(url: string, data: U): Promise<T> {
	return request<T>(url, {
		method: "POST",
		body: JSON.stringify(data)
	});
}
