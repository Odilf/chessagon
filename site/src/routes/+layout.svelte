<script lang="ts">
  import { invalidate } from "$app/navigation";
  import {
    Modal,
    Toast,
    autoModeWatcher,
    initializeStores,
  } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import "../app.postcss";

  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => subscription.unsubscribe();
  });

  initializeStores();
</script>

<svelte:head>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}

  <link
    rel="preload"
    href="/fonts/AtkinsonHyperlegible-Regular.ttf"
    as="font"
    type="font/ttf"
    crossorigin="anonymous"
  />

  <link
    rel="preload"
    href="/fonts/AtkinsonHyperlegible-Bold.ttf"
    as="font"
    type="font/ttf"
    crossorigin="anonymous"
  />
</svelte:head>

<Toast />
<Modal />

<slot />
