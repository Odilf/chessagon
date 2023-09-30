<script>
  import Nav from "../Nav.svelte";
</script>

<main class="px-2 max-w-xl mx-auto flex flex-col items-center overflow-x-hidden">
  <Nav />

  <slot />
</main>

<style>
  main {
    height: 100dvh;
    width: 100vw;
  }
</style>
