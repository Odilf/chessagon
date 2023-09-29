<script lang="ts">
  import "../app.postcss";
  import "../styles.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  import { AppBar, Toast, autoModeWatcher } from "@skeletonlabs/skeleton";

  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      console.log("auth changed", event, _session);
      console.log("current", session);

      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => subscription.unsubscribe();
  });

  import { initializeStores } from '@skeletonlabs/skeleton';
  import { page } from "$app/stores";
  import Nav from "./Nav.svelte";

  initializeStores();
</script>

<svelte:head>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<Toast />

<main class="px-2 max-w-xl mx-auto">
  <Nav />

  <slot />
</main>

<style>
  main {
    height: 100dvh;
    width: 100vw;

    display: flex;
    flex-direction: column;
    /* padding-top: 2em; */
    padding-bottom: 5em;
    /* justify-content: center; */
    align-items: center;
  }
</style>
