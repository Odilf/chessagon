import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from "$env/static/public";
import Pusher from "pusher-js";
import type { Readable } from "svelte/store";

let pusher: Pusher | null = null;
export const getPusher = () =>
  (pusher ??= new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: PUBLIC_PUSHER_CLUSTER,
  }));

export function pusherStore<T>(
  channelName: string,
  event: string,
): Readable<T> {
  return {
    subscribe: (callback) => {
      const pusher = getPusher();

      const channel = pusher.subscribe(channelName);
      channel.bind(event, callback);
      return () => pusher.connection.unbind("connected", callback);
    },
  };
}
