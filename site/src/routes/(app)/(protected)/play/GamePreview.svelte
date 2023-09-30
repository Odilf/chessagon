<script lang="ts">
  import { Color } from "$engine/chessagon";
  import type { TimeControl } from "$lib/timeControls";

  export let challenger: { username: string; color: Color | null };
  export let timeControl: TimeControl;
</script>

<button
  class="btn card variant-soft-secondary p-4 flex-col items-start flex-1"
  on:click
>
  <div>
    <span class="h2">{timeControl.toString()}</span>
    <span class="h3 pl-2"> by {challenger.username} </span>
  </div>
  {#if challenger.color !== null}
    <span class="">
      As {Color[1 - challenger.color].toLocaleLowerCase()}
    </span>
  {/if}
</button>
