<script>
  export let data;
</script>

<main>
  <h1>Chessagon</h1>
  <h2>Hexagonal chess!</h2>

  {#if data.session?.user}
    <p> Welcome, {data.session?.user.email}</p>
  {:else}
    <p>You're not logged in yet</p>
    <div>
      <a href="/login"> Login or register </a>
    </div>
  {/if}
</main>

<style>
  main {
    height: 100dvh;
    width: 100vw;

    display: flex;
    flex-direction: column;
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

  h1 {
    margin-block: 0;
    font-size: 7em;
  }

  h2 {
    font-size: 3em;
  }
</style>
