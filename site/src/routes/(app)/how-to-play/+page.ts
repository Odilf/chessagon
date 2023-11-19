import { Color, Piece, PieceType, Vector } from "$engine/chessagon";
import { positions as boardPositions } from "$lib/board/Board.svelte";

export const prerender = true;

export async function load({}) {
  const data = new Map(
    [
      {
        type: PieceType.Pawn,
        positions: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      },

      {
        type: PieceType.Rook,
        positions: Array.from({ length: 11 }, (_, i) => [
          [i - 5, 0],
          [i - 5, i - 5],
          [0, i - 5],
        ]).flat(),
      },

      {
        type: PieceType.Bishop,
        positions: boardPositions
          .map((position) => [position.x, position.y])
          .filter(([x, y]) => x === 2 * y || y === 2 * x || x === -y),
      },

      {
        type: PieceType.Knight,
        positions: boardPositions
          .map((position) => [position.x, position.y])
          .filter(
            ([x, y]) =>
              x * y === 3 ||
              x * y === -2 ||
              (x !== 6 && y !== 6 && x * y === 6),
          ),
      },

      {
        type: PieceType.King,
        positions: boardPositions
          .map((position) => [position.x, position.y])
          .filter(
            ([x, y]) =>
              (Math.abs(x) === 1 && [-1, 0, 1, 2].includes(y * Math.sign(x))) ||
              (Math.abs(y) === 1 && [-1, 0, 1, 2].includes(x * Math.sign(y))),
          ),
      },
    ].map(({ type, positions }) => [type, [...positions, [0, 0]]]),
  );

  data.set(PieceType.Queen, [
    ...data.get(PieceType.Rook)!,
    ...data.get(PieceType.Bishop)!,
  ]);

  const pieces = Array.from(data, ([type, arrayPositions]) => {
    const positions = arrayPositions.map(([x, y]) => new Vector(x, y));
    const piece = new Piece(Color.White, type, new Vector(0, 0));

    return {
      piece,
      positions,
    };
  });

  return {
    pieces,
  };
}
