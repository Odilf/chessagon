<script>
  import Nav from "../Nav.svelte";

  const navBarHeight = {
    heightClass: "h16",
    css: "4rem",
  };
</script>

<main class="overflow-x-hidden">
  <Nav />

  <div
    class="flex-1 mx-auto flex flex-col items-center"
    style:--height={navBarHeight.css}
  >
    <slot />
  </div>
</main>

<style>
  main {
    height: 100dvh;
    width: 100vw;
  }

  main > :global(*) {
    --screen-without-nav: calc(100dvh - var(--height));
  }

  div {
    height: var(--screen-without-nav);
  }
</style>
