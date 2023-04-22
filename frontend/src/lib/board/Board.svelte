<script context='module'>
	export const alignmentKey = Symbol('alignment')
</script>

<script lang="ts">
	import type { Alignment, Vector } from "$lib/vectors";
	import { capture, getInitialSetup, type Color, type MoveFilterGetter, type Piece as PieceType } from "./pieces";
	import Piece from "./Piece.svelte";
	import Tile from "./Tile.svelte";
	import { fade } from "svelte/transition";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";

	export let positions: Vector[]
	export let playing: Color = 'white'
	export let getMoveFilter: MoveFilterGetter
	export let hexagonalAlignment: Alignment

	const alignmentStore = writable(hexagonalAlignment)
	setContext(alignmentKey, alignmentStore)

	

	const changeColor = (p: 'white' | 'black') => p === 'white' ? 'black' : 'white'
	let pieces = getInitialSetup()

	let selectedPiece: PieceType | null = null
	$: canMove = getMoveFilter(selectedPiece, pieces, playing)

	function select(piece: PieceType) {
		if (selectedPiece === piece) {
			selectedPiece = null
		} else {
			selectedPiece = piece
		}
	}

	function tryMove(position: Vector) {
		if (!selectedPiece || !canMove(position)) {
			return			
		}

		selectedPiece.position = position // Move
		selectedPiece = null // Deselect
		capture(position, pieces[changeColor(playing)]) // Capture
		// playing = changeColor(playing) // Change turn
		pieces = pieces // Update
	}	
</script>

<svg viewBox="-10 -10 20 20">
	<g id=tiles>
		{#each positions as position}
			<Tile {position} on:click={() => selectedPiece = null}/>
		{/each}	
	</g>

	{#key selectedPiece}
		<g id=indicators >
		{#each positions.filter(canMove) as position}
			{@const duration = selectedPiece ? Math.sqrt((selectedPiece.position.x - position.x)**2 + (selectedPiece.position.x - position.x)**2) * 20 + 20 : 100}
			<g class='indicator' transition:fade={{ duration }}>
				<Tile {position} on:click={() => tryMove(position)}/>
			</g>
		{/each}	
		</g>
	{/key}

	<g id=pieces>
		<g class={playing === 'white' ? 'player' : 'opponent'}>
			{#each pieces.white as piece}
				<Piece color="white" {piece} on:click={() => select(piece)}/>
			{/each}
		</g>

		<g class={playing === 'black' ? 'player' : 'opponent'}>
			{#each pieces.black as piece}	
				<Piece color="black" {piece} on:click={() => select(piece)}/>
			{/each}
		</g>
	</g>
</svg>

<style>
	svg {
		height: 95vh;
	}

	#indicators {
		cursor: pointer;
		filter: hue-rotate(60deg) brightness(110%) drop-shadow(0 0 0.1px hsla(250, 60%, 50%, 0.3));
	}

	.opponent {
		pointer-events: none;
	}

	.indicator {
		transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 100ms;
	}

	.indicator:hover {
		filter: brightness(110%);
	}
</style>
