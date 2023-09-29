import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), vitePreprocess({})],

  vitePlugin: {
    // inspector: true,
  },

  kit: {
    adapter: adapter(),
    alias: {
      $engine: ".wasm-engine/",
    },
  },
};

export default config;
