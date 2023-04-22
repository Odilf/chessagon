import type { Vector } from "./vectors";

export function coordsToSVGString(coords: Vector[]): string {
	return coords.map(coord => `${coord.x},${coord.y}`).join(' ')
}

export function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

export function vmod(v: Vector, m = 3) {
	return mod(v.x + v.y, 3)
}