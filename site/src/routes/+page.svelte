<script>
  import { setContext } from "svelte";
  import Title from "./Title.svelte";

  export let data;

  import { getToastStore } from "@skeletonlabs/skeleton";
  import { hideNavSymbol } from "./Nav.svelte";

  const toastStore = getToastStore();

  setContext(hideNavSymbol, true);
</script>

<div class="grid place-items-center h-full">
  <Title />

  <div class="grid grid-cols-6 gap-5 mt-8">
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
      Login / register
    </a>

    <a class="btn variant-ghost-primary col-span-2 px-8" href="/about">
      About
    </a>
    <a class="btn variant-ghost-primary col-span-2 px-8" href="/explore">
      Explore
    </a>
    <a class="btn variant-ghost-primary col-span-2 px-8" href="/how-to-play">
      How to play
    </a>
  </div>
</div>

<style>
  .disabled {
    /* pointer-events: none; */
    cursor: default;
    opacity: 0.6;
  }
</style>
