<script>
  import Nav from "../Nav.svelte";

  const navBarHeight = {
    heightClass: "h16",
    css: "4rem",
  };
</script>

<main class="w-screen overflow-x-hidden hide-scrollbar">
  <Nav />

  <div
    class="flex-1 flex flex-col items-center w-screen overflow-hidden"
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
