import { NextResponse } from "next/server";

export function middlewareChain(functions, index = 0) {
	const current = functions[index];

	if (current) {
		const next = middlewareChain(functions, index + 1);
		return (req, evt) => current(req, evt, next);
	}

	return (req, evt) => NextResponse.next();
}
