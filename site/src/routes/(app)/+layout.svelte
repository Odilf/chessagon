<script>
  import Nav from "../Nav.svelte";

  const navBarHeight = {
    heightClass: "h16",
    css: "4rem",
  };
</script>

<main class="scrollbar-gutter-stable w-screen h-screen">
  <Nav />

  <div
    class="flex-1 flex flex-col items-center w-screen"
    style:--height={navBarHeight.css}
  >
    <slot />
  </div>
</main>

<style>
  main > :global(*) {
    --screen-without-nav: calc(100dvh - var(--height));
  }

  div {
    height: var(--screen-without-nav);
  }
</style>
