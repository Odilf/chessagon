<script>
  import Title from "./Title.svelte";
  import { getToastStore } from "@skeletonlabs/skeleton";

  export let data;

  const toastStore = getToastStore();
</script>

<main class="flex flex-col justify-center h-screen" data-sveltekit-preload-data>
  <Title />

  <div class="grid grid-cols-6 gap-5 mt-8 px-3 max-w-xl mx-auto">
    <a
      class="btn variant-filled col-span-3 px-8"
      href={data.session ? "/play" : ""}
      aria-disabled={!data.session}
      class:disabled={!data.session}
      title="You need to be logged in to play"
      on:click={() => {
        if (!data.session) {
          toastStore.trigger({
            message: "You need to be logged in to play",
            background: "variant-filled-error",
          });
        }
      }}
    >
      Play
    </a>
    <a class="btn variant-filled col-span-3 px-8" href="/login">
      {#if data.session}
        Profile
      {:else}
        Login / register
      {/if}
    </a>

    <a class="btn variant-ghost-primary col-span-2 px-8" href="/how-to-play">
      How to play
    </a>
    <a class="btn variant-ghost-primary col-span-2 px-8" href="/about">
      About
    </a>
    <a class="btn variant-ghost-primary col-span-2 px-8" href="/explore">
      Explore
    </a>
  </div>
</main>

<style>
  .disabled {
    /* pointer-events: none; */
    cursor: default;
    opacity: 0.6;
  }
</style>
