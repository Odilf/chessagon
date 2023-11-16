import { Color } from "$engine/chessagon";

export type WinReason = "checkmate" | "out_of_time" | "resignation";
export type DrawReason =
  | "agreement"
  | "stalemate"
  | "insufficient_material"
  | "threefold_repetition"
  | "fifty_rule_move";

export type Status =
  | { inProgress: true }
  | { inProgress: false; winner: Color; reason: WinReason }
  | { inProgress: false; winner: null; reason: DrawReason };

/**
 * Converts a status code to a status object.
 *
 * The values for the different status codes are defined in the rust side.
 *
 * Returns `null` if the status code is invalid.
 */
export function getStatusFromCode(code: number): Status | null {
  switch (code) {
    case 0:
      return { inProgress: true };

    case 100:
      return { inProgress: false, winner: Color.White, reason: "checkmate" };
    case 101:
      return { inProgress: false, winner: Color.White, reason: "resignation" };
    case 102:
      return { inProgress: false, winner: Color.White, reason: "out_of_time" };

    case 200:
      return { inProgress: false, winner: Color.Black, reason: "checkmate" };
    case 201:
      return { inProgress: false, winner: Color.Black, reason: "resignation" };
    case 202:
      return { inProgress: false, winner: Color.Black, reason: "out_of_time" };

    case 300:
      return { inProgress: false, winner: null, reason: "agreement" };
    case 301:
      return { inProgress: false, winner: null, reason: "stalemate" };
    case 302:
      return {
        inProgress: false,
        winner: null,
        reason: "insufficient_material",
      };
    case 303:
      return {
        inProgress: false,
        winner: null,
        reason: "threefold_repetition",
      };
    case 304:
      return { inProgress: false, winner: null, reason: "fifty_rule_move" };

    default:
      return null;
  }
}

export function getCodeFromStatus(status: Status): number {
  if (status.inProgress) {
    return 0;
  }

  // TODO: Check this is correct, written by Copilot (seems rigth)
  switch (status.reason) {
    case "checkmate":
      return status.winner === Color.White ? 100 : 200;
    case "resignation":
      return status.winner === Color.White ? 101 : 201;
    case "out_of_time":
      return status.winner === Color.White ? 102 : 202;
    case "agreement":
      return 300;
    case "stalemate":
      return 301;
    case "insufficient_material":
      return 302;
    case "threefold_repetition":
      return 303;
    case "fifty_rule_move":
      return 304;
  }
}

export const IN_PROGRESS = 0 as const;

function formatWin(reason: WinReason, color: Color): string {
  switch (reason) {
    case "checkmate":
      return "By checkmate";
    case "resignation":
      return `${Color[1 - color]} resigned`;
    case "out_of_time":
      return `${Color[1 - color]} ran out of time`;
  }
}

function formatDraw(reason: DrawReason): string {
  switch (reason) {
    case "agreement":
      return "By agreement";
    case "stalemate":
      return "By stalemate";
    case "insufficient_material":
      return "By insufficient material";
    case "threefold_repetition":
      return "By threefold repetition";
    case "fifty_rule_move":
      return "By fifty rule move";
  }
}

export function formatStatus(status: Status) {
  if (status.inProgress) {
    return {
      title: "In progress",
      subtitle: "Game is in progress",
    };
  }

  if (status.winner !== null) {
    return {
      title: `${Color[status.winner]} won`,
      subtitle: formatWin(status.reason, status.winner),
    };
  }

  return {
    title: "Draw",
    subtitle: formatDraw(status.reason),
  };
}
