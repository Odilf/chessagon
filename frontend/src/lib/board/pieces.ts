import { equals, sum, v, Vector } from "$lib/vectors";
import { rookFilter } from "./moves";

export function createBoard(size: number) {
	let c: Vector[] = []

	for (let i = -size; i <= size; i++) {
		for (let j = -size; j <= size; j++) {
			if (Math.abs(i - j) <= size) {
				c.push(new Vector(i, j))
			}
		}
	}
	
	return c
}

export type Type = 'pawn'
				 | 'bishop'
				 | 'knight'
				 | 'rook'
				 | 'queen'
				 | 'king'



export interface Piece {
	position: Vector
	type: Type
}

export type Color = 'white' | 'black'
export const toggle = (color: Color): Color => color === 'white' ? 'black' : 'white'

function piece(type: Type, x: number, y: number): Piece { 
	return { type, position: new Vector(x, y) }
}

const initialSetup = [
	...[...Array(5).keys()].map(i => piece('pawn', 1, i + 1)),
	...[...Array(4).keys()].map(i => piece('pawn', i + 2, 1)),

	piece('rook', 5, 2),
	piece('rook', 2, 5),

	piece('knight', 5, 3),
	piece('knight', 3, 5),

	piece('bishop', 3, 3),
	piece('bishop', 4, 4),
	piece('bishop', 5, 5),

	piece('queen', 5, 4), 
	piece('king', 4, 5),
]

export function getInitialSetup() {
	return {
		white: [...initialSetup],
		black: [
			...initialSetup.slice(0, 16), 
			piece('king', 5, 4), 
			piece('queen', 4, 5)
		].map(p => piece(p.type, -p.position.x, -p.position.y)),
	}
}

type MoveFilter = (position: Vector) => boolean
export type MoveFilterGetter = (piece: Piece | null, pieces: { white: Piece[], black: Piece[] }, playing: Color) =>  MoveFilter

export function getMoveFilter(piece: Piece | null, pieces: { white: Piece[], black: Piece[] }, playing: 'white' | 'black'): MoveFilter  {
	const opponent = pieces[playing === 'white' ? 'black' : 'white']
	const allPieces = [...pieces.white, ...pieces.black]

	if (piece === null) {
		return _ => false
	}

	const isOnPiece: MoveFilter = position => {
		return pieces[playing].some(piece => equals(piece.position, position))
	}

	switch (piece.type) {
		case 'bishop': {
			const m = piece.position.x + piece.position.y
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const dif = sum(piece.position, position.scale(-1))
				
				return position.x + position.y === m
				|| dif.x / dif.y === 2
				|| dif.y / dif.x === 2
			}
		}

		case 'rook': {
			return target => rookFilter(piece.position, target, allPieces)
			// const dif = piece.position.x - piece.position.y

			// const caca = allPieces
			
			// return target => {
			// 	if (isOnPiece(target)) {
			// 		return false
			// 	}

			// 	const delta = sum(target, piece.position.scale(-1))

			// 	if (piece.position.x === target.x) {
			// 		return true
			// 		const dy = target.y - piece.position.y

			// 		const isPieceInBetween = allPieces.some(opPiece => {
			// 			if (opPiece.position.x === target.x) {
			// 				const dy2 = target.y - opPiece.position.y
			// 				if (dy > 0) {
			// 					return dy2 > 0 && dy2 < dy
			// 				} else {
			// 					return dy2 < 0 && dy2 > dy
			// 				}
			// 			} else {
			// 				return false
			// 			}
			// 		})

			// 		return !isPieceInBetween
			// 	} else if (piece.position.y === target.y) {
			// 		return true
			// 		const dir = piece.position.x > target.x ? -1 : 1
			// 		return !allPieces.some(p => p.position.y === target.y 
			// 								&& piece.position.x * dir < p.position.x * dir
			// 								&& p.position.x * dir < target.x * dir)
			// 	} else if (target.x - target.y === dif) {
			// 		return true
			// 		const dir = piece.position.x > target.x ? -1 : 1
			// 		return !allPieces.some(opPiece => opPiece.position.x - opPiece.position.y === dif
			// 										&& opPiece.position.x - piece.position.x < delta.scale(dir).x)
			// 	} else {
			// 		return false
			// 	}
			// }
		}

		case 'queen': {
			const rookFilter = getMoveFilter({ type: 'rook', position: piece.position }, pieces, playing)
			const bishopFilter = getMoveFilter({ type: 'bishop', position: piece.position }, pieces, playing)
			return position => rookFilter(position) || bishopFilter(position)
		}

		case 'pawn': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const order = playing === 'white' ? -1 : 1
				const delta = sum(position, piece.position.scale(-1)).scale(order)

				if (opponent.some(piece => equals(piece.position, position))) {
					return equals(delta, v(1, 0)) || equals(delta, v(0, 1))
				}

				const isStartingPosition = piece.position.x == -order || piece.position.y == -order

				const canMove = isStartingPosition 
				? equals(delta, v(1, 1)) || (equals(delta, v(2, 2)) && !opponent.some(p => equals(p.position, sum(v(1, 1).scale(order), piece.position))))
				: equals(delta, v(1, 1))

				return canMove
			}
		}

		case 'knight': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}
				
				const dx = piece.position.x - position.x
				const dy = piece.position.y - position.y
				return knight_moves.some(move => move.x === dx && move.y === dy)
			}
		}

		case 'king': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const dx = Math.abs(piece.position.x - position.x)
				const dy = Math.abs(piece.position.y - position.y)

				return dx + dy < 3 && !(dx === 0 && dy === 2) && !(dx === 2 && dy === 0)
			}
		}
	
		default:
			// return moveFilter(null, pieces, playing)
			throw new Error("Caca");
	}
}

const knight_moves = [
	new Vector(3, 1), new Vector(3, 2),
	new Vector(1, 3), new Vector(2, 3),
	new Vector(-1, 2), new Vector(-2, 1),

	new Vector(-3, -1), new Vector(-3, -2),
	new Vector(-1, -3), new Vector(-2, -3),
	new Vector(1, -2), new Vector(2, -1),
]

export function capture(position: Vector, opponent_pieces: Piece[]) {
	const index = opponent_pieces.findIndex(piece => equals(position, piece.position))

	if (index === -1) {
		return null 
	} else {
		return opponent_pieces.splice(index, 1)
	}
}