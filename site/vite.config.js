import { sveltekit } from "@sveltejs/kit/vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
// import { ViteFaviconsPlugin } from "vite-plugin-favicon2";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    // ViteFaviconsPlugin("./static/favicon.svg"),
    topLevelAwait(),
    wasm(),
    sveltekit(),
  ],

  server: {
    fs: {
      allow: ["./.wasm-engine"],
    },
  },
};

export default config;
