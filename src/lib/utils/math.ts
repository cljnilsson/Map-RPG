export function bezier(t: number, p0: pos, p1: pos, p2: pos): pos {
	const u = 1 - t;

	return {
		x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
		y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
	};
}

export function getControlPoint(a: pos, b: pos, curve: number): pos {
	// midpoint
	const mx = (a.x + b.x) / 2;
	const my = (a.y + b.y) / 2;

	// direction vector
	const dx = b.x - a.x;
	const dy = b.y - a.y;

	// perpendicular vector (normalized)
	const length = Math.sqrt(dx * dx + dy * dy) || 1;
	const nx = -dy / length;
	const ny = dx / length;

	// offset midpoint to create curve
	return {
		x: mx + nx * length * curve,
		y: my + ny * length * curve,
	};
}

export type pos = {
	x: number;
	y: number;
};