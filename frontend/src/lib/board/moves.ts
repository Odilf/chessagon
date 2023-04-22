import type { Vector } from "$lib/vectors";
import type { Piece, Color } from "./pieces";
import { toggle } from "./pieces";

type Pieces = { white: Piece[], black: Piece[] }

// Rook filter
const rookFilterX = (position: Vector, target: Vector) => position.y === target.y
const rookFilterY = (position: Vector, target: Vector) => position.x === target.x
const rookFilterVertical = (position: Vector, target: Vector) => {
	const delta = position.to(target)
	return delta.x === delta.y
} 

function rookFilterPlain(position: Vector, target: Vector) {
	return rookFilterX(position, target) 
		|| rookFilterY(position, target)
		|| rookFilterVertical(position, target)
}

export function rookFilter(position: Vector, target: Vector, pieces: Piece[]) {
	if (rookFilterX(position, target)) {
		const pool = pieces.filter(piece => rookFilterX(position, piece.position))
		return true
	} else {
		return false
	}
}

export function getClosestPiece(position: Vector, pieces: Piece[]) {
	const xIntersect = pieces.filter(piece => rookFilterX(position, piece.position))
	const xPos = xIntersect.filter(piece => position.to(piece.position).x > 0)
	const xNeg = xIntersect.filter(piece => position.to(piece.position).x < 0)

	const c = closestDistance(position, xPos)

	
	
	

	// return distances
}

function closestDistance(position: Vector, pieces: Piece[]) {
	let distance = Infinity

	for (let piece of pieces) {
		const length = position.to(piece.position).length2()
		if (length < distance) {
			distance = length
		}
	}

	return distance
}