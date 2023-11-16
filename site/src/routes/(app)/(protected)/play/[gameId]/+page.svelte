<script lang="ts">
  import GameOverScreen from "./GameOverScreen.svelte";
  import { Color, Vector } from "$engine/chessagon";
  import { onDestroy, onMount } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import unwrap from "ts-unwrap";
  import {
    gameChannel,
    newMoveEventName,
    type NewMoveEventData,
    gameFinishedEvent,
    gameStartedEvent,
    drawOfferEvent,
  } from "$lib/pusher/events";
  import type { Channel } from "pusher-js";
  import { invalidateAll } from "$app/navigation";
  import LiveBoard from "./LiveBoard.svelte";
  import type { Move } from "$lib/wasmTypesGlue";
  import {
    acceptDraw,
    checkForTime,
    retractDrawOffer,
    sendMove,
    sendResignation,
  } from "$lib/db/actions/client";
  import { createGameStore } from "$lib/board/gameStore";
  import { getPusher } from "$lib/pusher/client";
  import { offerDraw } from "$lib/db/actions/client";
  import { getToastStore } from "@skeletonlabs/skeleton";

  export let data;

  let gameStore = createGameStore(data.game.moves);

  const toastStore = getToastStore();

  async function handleMove(move: Move) {
    const request = sendMove(data.game.id, move);

    gameStore.makeMove(move);

    const response = await request;
    if (!response.ok) {
      gameStore.undoLastMove();
      console.warn("move send went wrong", response.statusText);
      toastStore.trigger({
        message: `Something went wrong when sending move (${response.statusText})`,
      });
    }
  }

  function subscribeToInGameEvents() {
    console.log("subscribing to in game events");
    console.log("channel", channel);

    if (!channel) {
      throw new Error("unreachable (open issue if you encounter this)");
    }
    
    channel.bind(gameFinishedEvent, () => {
      console.log("game finished");

      invalidateAll();
    });

    channel.bind(drawOfferEvent(1 - data.playerColor), () => {
      console.log("draw offer received");
      invalidateAll();
    });

    console.log(channel?.callbacks);
    
  }

  let channel: Channel | null = null;
  onMount(() => {
    console.log("running onMount");
    
    channel = getPusher().subscribe(gameChannel(unwrap(data.game.id)));

    channel.bind(newMoveEventName, (move: NewMoveEventData) => {
      const { origin, target } = move;

      gameStore.makeMove({
        origin: new Vector(origin.x, origin.y),
        target: new Vector(target.x, target.y),
      });
    });

    if (data.game.isActive) {
      subscribeToInGameEvents();
    } else {
      channel.bind(gameStartedEvent, async () => {
        console.log("game started");
        
        await invalidateAll();
        subscribeToInGameEvents();
      });
    }
  });

  onDestroy(() => {
    channel?.unbind_all();
  });
</script>

{#if data.game.isActive}
  <div class="h-full w-full max-h-full relative">
    <GameOverScreen
      status={data.game.status}
      gameId={data.game.id}
      overrideHide={$gameStore.moveIndex !== data.game.moves.length}
    />

    <LiveBoard
      game={{
        ...data.game,
        playerColor: data.playerColor,
      }}
      {gameStore}
      drawOffer={data.game.drawOffers}
      on:move={({ detail: move }) => handleMove(move)}
      on:outOfTime={async () => {
        await checkForTime(data.game.id);
        await invalidateAll();
      }}
      on:resignation={async () => await sendResignation(data.game.id)}
      on:drawOffer={async () => {
        await offerDraw(data.game.id);
        data.game.drawOffers = { from: data.playerColor };
      }}
      on:drawAccepted={async () => {
        await acceptDraw(data.game.id);
      }}
      on:drawOfferRetraction={async () => {
        await retractDrawOffer(data.game.id);
        data.game.drawOffers = null;
      }}
    />
  </div>
{:else}
  <form
    method="post"
    action="?/cancelGame"
    use:enhance
    class="flex flex-col items-center"
  >
    <WaitingForPlayer
      timeControl={data.game.timeControl}
      host={{ color: data.game.black ? Color.Black : Color.White }}
      gameId={data.game.id}
    />
  </form>
{/if}
