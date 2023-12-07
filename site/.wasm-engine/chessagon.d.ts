/* tslint:disable */
/* eslint-disable */
/**
* @param {number} color
* @returns {boolean}
*/
export function should_flip(color: number): boolean;
/**
*/
export enum Alignment {
  Vertical = 0,
  Horizontal = 1,
}
/**
*/
export enum PieceType {
  Pawn = 0,
  Knight = 1,
  Bishop = 2,
  Rook = 3,
  Queen = 4,
  King = 5,
}
/**
*/
export enum Color {
  White = 0,
  Black = 1,
}
/**
*/
export class Board {
  free(): void;
/**
* @param {Vector} position
* @returns {Piece | undefined}
*/
  piece_at(position: Vector): Piece | undefined;
/**
*/
  constructor();
}
/**
* A 2D vector with floating point coordinates in canonical (or cartesian or standard) basis.
*/
export class CanonicalVector {
  free(): void;
/**
* @param {number} alignment
* @param {number} radius
* @returns {string}
*/
  svg_points(alignment: number, radius: number): string;
/**
*/
  x: number;
/**
*/
  y: number;
}
/**
*/
export class GameState {
  free(): void;
/**
*/
  constructor();
/**
* @param {Vector} origin
* @param {Vector} target
* @returns {boolean}
*/
  can_move(origin: Vector, target: Vector): boolean;
/**
* @param {Vector} origin
* @param {Vector} target
* @returns {Piece | undefined}
*/
  try_move(origin: Vector, target: Vector): Piece | undefined;
/**
* @returns {number}
*/
  turn(): number;
/**
* @returns {number}
*/
  current_color(): number;
/**
* @returns {number}
*/
  status_code(): number;
/**
*/
  board: Board;
}
/**
*/
export class Move {
  free(): void;
/**
* @param {Vector} origin
* @param {Vector} target
*/
  constructor(origin: Vector, target: Vector);
/**
* @returns {Vector}
*/
  delta(): Vector;
/**
*/
  origin: Vector;
/**
*/
  target: Vector;
}
/**
*/
export class Piece {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {number} color
* @param {number} typ
* @param {Vector} position
*/
  constructor(color: number, typ: number, position: Vector);
/**
*/
  color: number;
/**
*/
  position: Vector;
/**
*/
  typ: number;
}
/**
* A 2D vector with integer coordinates in hexagonal basis.
*/
export class Vector {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @param {number} x
* @param {number} y
*/
  constructor(x: number, y: number);
/**
* @param {number} alignment
* @param {boolean} flip
* @returns {CanonicalVector}
*/
  to_canonic(alignment: number, flip: boolean): CanonicalVector;
/**
* @param {number} color
* @returns {Vector}
*/
  normalized(color: number): Vector;
/**
* Returns the vertical component of the vector if it is vertical, otherwise returns `None`.
*
* In hexagonal coords, a vector is vertical if its x and y components are equal.
* @returns {number | undefined}
*/
  vertical(): number | undefined;
/**
* @param {Vector} factor
* @returns {number | undefined}
*/
  multiplicity_of(factor: Vector): number | undefined;
/**
*/
  x: number;
/**
*/
  y: number;
}
