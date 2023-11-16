import type { Color } from "$engine/chessagon";
import type { Move } from "$lib/wasmTypesGlue";

export async function sendMove(gameId: string, move: Move) {
  const { origin, target } = move;

  return await fetch(`/play/${gameId}/send-move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/blob",
    },
    body: Int8Array.from([origin.x, origin.y, target.x, target.y]),
  });
}

/**
 * Makes a request to the server to see if the player has run out of time.
 *
 * Used to update the database once one of the clients know that the player has run out of time.
 */
export async function checkForTime(gameId: string) {
  return await fetch(`/play/${gameId}/check-for-time`, {
    method: "POST",
  });
}

export async function offerDraw(gameId: string) {
  return await fetch(`/play/${gameId}/offer-draw`, {
    method: "POST",
  });
}

export async function retractDrawOffer(gameId: string) {
  return await fetch(`/play/${gameId}/retract-draw-offer`, {
    method: "POST",
  });
}

export async function acceptDraw(gameId: string) {
  return await fetch(`/play/${gameId}/accept-draw`, {
    method: "POST",
  });
}

export async function sendResignation(gameId: string) {
  return await fetch(`/play/${gameId}/resign`, {
    method: "POST",
  });
}
