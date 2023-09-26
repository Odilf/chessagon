<script>
	import Board from "$lib/board/Board.svelte";
	import { createBoard, getMoveFilter } from "$lib/board/pieces";
</script>


<Board positions={createBoard(5)} getMoveFilter={getMoveFilter} />
