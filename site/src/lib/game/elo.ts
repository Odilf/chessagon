const K = 32;

export function expectedScore(ratings: { player: number; opponent: number }) {
  return 1 / (1 + 10 ** ((ratings.player - ratings.opponent) / 400));
}

export function updatedRating(
  ratings: { player: number; opponent: number },
  score: number,
  numberOfGames = 1,
) {
  return ratings.player + K * (score / numberOfGames - expectedScore(ratings));
}
