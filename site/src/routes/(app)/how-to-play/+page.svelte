<script>
  import { Color, PieceType } from "$engine/chessagon";
  import Board from "$lib/board/Board.svelte";

  export let data;
</script>

<main class="w-full pt-8 px-2 pb-16 overflow-x-hidden">
  <h1 class="h1 text-center mb-8">How to play</h1>

  <h2 class="text-center h2 mb-4">Initial configuration</h2>
  <div class="pointer-events-none max-w-xl mx-auto">
    <Board playerColor={Color.White} />
  </div>

  <h2 class="text-center h2 mt-8 mb-4">Pieces</h2>
  <div class="flex flex-wrap justify-center gap-8">
    {#each data.pieces as { piece, positions }}
      <div>
        <h3 class="h3 text-center mb-4">{PieceType[piece.typ]}</h3>
        <div class="pointer-events-none">
          <Board
            board={{
              piece_at: (position) =>
                position.x == piece.position.x && position.y == piece.position.y
                  ? piece
                  : undefined,
            }}
            playerColor={Color.White}
            highlightPositions={positions}
          />
        </div>
      </div>
    {/each}
  </div>

  <div class="flex flex-col items-center gap-4 my-4">
    <a href="/play" class="btn variant-ghost-primary"> Play online games </a>
    <a href="/explore" class="btn variant-soft-secondary">
      Explore the board on your own
    </a>
  </div>
</main>
