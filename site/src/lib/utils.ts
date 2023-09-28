import type { Vector } from "$engine";
import type { CanonicalVector } from "$engine";

export function coordsToSVGString(coords: CanonicalVector[]): string {
  return coords.map((coord) => `${coord.x},${coord.y}`).join(" ");
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function vector_mod(v: Vector, m = 3) {
  return mod(v.x + v.y, m);
}
