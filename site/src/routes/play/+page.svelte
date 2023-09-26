<script lang="ts">
	import { timeControls } from '$lib/timeControls';
</script>

<main class='main-column'>
	<h1>Play</h1>
	<p>Select a time control</p>

	{#each timeControls as { minutes, increment }}
		<a> {minutes}-{increment} </a>
	{/each}
</main>
