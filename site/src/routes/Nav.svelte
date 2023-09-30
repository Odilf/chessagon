<script>
  import { page } from "$app/stores";
  import { AppBar } from "@skeletonlabs/skeleton";

  // paths where the nav should be hidden
  const hideNavPaths = ["/"];

  $: hidden = hideNavPaths.includes($page.url.pathname);
</script>

<AppBar class="w-screen {hidden && 'hidden'}">
  <a slot="lead" href="../">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="3"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
      />
    </svg>
  </a>

  <h1 class="font-normal">{$page.url.pathname.split("/").at(-1)}</h1>
  <svelte:fragment slot="trail">
    <a class="btn variant-ghost-primary" href="/profile">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    </a>
  </svelte:fragment>
</AppBar>
