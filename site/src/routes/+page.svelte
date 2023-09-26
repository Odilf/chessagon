<main>
	<h1> Chessagon </h1>
	<p> Hexagonal chess. </p>
	
	<div>
	 	<a href="/play"> Play </a>
	 	<a href="/explore"> Explore </a>
		<a href="/about"> About </a>
		<a href="/settings"> Settings </a>
	</div>

</main>

<style>
	main {
		height: 100dvh;
		width: 100vw;

		display: flex;
		flex-direction:	column;
		justify-content: center;
		align-items: center;
	}

	div {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		gap: 1em;
	}
</style>
