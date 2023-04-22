export class Vector {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	scale(scalar: number): Vector {
		return v(this.x * scalar, this.y * scalar)
	}

	to(destination: Vector) {
		return v(destination.x - this.x, destination.y - this.y)
	}

	length2 = () => this.x ** 2 + this.y ** 2
	length = () => Math.sqrt(this.length2())
}

export function v(x: number, y: number) {
	return new Vector(x, y)
}

export const alpha = 2*Math.PI / 6
export const hexBase = {
	horizontal: {
		x: v(Math.cos(Math.PI - alpha/2), Math.sin(Math.PI - alpha/2)).scale(1.5/Math.cos(alpha/2)),
		y: v(Math.cos(alpha/2), Math.sin(alpha / 2)).scale(1.5/Math.cos(alpha/2)),
	},

	vertical: {
		x: v(2 * Math.cos(alpha/2), 0),
		y: v(Math.cos(2 * alpha), Math.sin(2 * alpha)).scale(2 * Math.cos(alpha/2)),
	}
}

export type Alignment = 'vertical' | 'horizontal'

export const hexagonPoints = {
	horizontal: [
		v(1,     0),
		v(0.5,   0.866),
		v(-0.5,  0.866),
		v(-1,    0),
		v(-0.5,  -0.866),
		v(0.5, -0.866),
	], 
	vertical: [
		v(0,     1),
		v(0.866, 0.5),
		v(0.866, -0.5),
		v(0,     -1),
		v(-0.866, -0.5),
		v(-0.866, 0.5),
	]
}

export const directions = [
	v(1, 0),
	v(1, 1),
	v(0, 1),
	v(0, -1),
	v(-1, -1),
	v(-1, 0),
]

export function sum(a: Vector, b: Vector): Vector {
	return v(a.x + b.x, a.y + b.y)
}

export function hexToCart(hex: Vector, alignment: Alignment): Vector {
	return sum(hexBase[alignment].x.scale(hex.x), hexBase[alignment].y.scale(hex.y))
}

export function equals(a: Vector, b: Vector) {
	return a.x === b.x && a.y === b.y
}