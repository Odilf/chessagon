<script lang="ts">
	import { mod } from "$lib/utils";

	import type { Vector } from "$lib/vectors";
	import { createEventDispatcher } from "svelte";
	import Hexagon from "./Hexagon.svelte";

	export let position: Vector

	export let lightnesses = [55, 65, 75]
	export let hue = 250

	const modulus = mod(position.x + position.y, 3)
	const dispatch = createEventDispatcher<{ click: Vector }>()
</script>


<Hexagon {position} color={{h: hue, s: 20, l: lightnesses[modulus]}} 
on:click={() => dispatch('click', position)} />

