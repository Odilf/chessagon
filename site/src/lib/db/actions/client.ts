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

export async function checkForTime(gameId: string) {
  return await fetch(`/play/${gameId}/check-for-time`, {
    method: "POST",
  });
}
