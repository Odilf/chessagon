// vite.config.js
import { sveltekit } from "file:///Users/odilf/Documents/Code/chessagon/site/node_modules/.pnpm/@sveltejs+kit@1.25.1_svelte@4.2.1_vite@4.4.9/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import topLevelAwait from "file:///Users/odilf/Documents/Code/chessagon/site/node_modules/.pnpm/vite-plugin-top-level-await@1.3.1_vite@4.4.9/node_modules/vite-plugin-top-level-await/exports/import.mjs";
import wasm from "file:///Users/odilf/Documents/Code/chessagon/site/node_modules/.pnpm/vite-plugin-wasm@3.2.2_vite@4.4.9/node_modules/vite-plugin-wasm/exports/import.mjs";
import { ViteFaviconsPlugin } from "file:///Users/odilf/Documents/Code/chessagon/site/node_modules/.pnpm/vite-plugin-favicon2@1.1.5_vite@4.4.9/node_modules/vite-plugin-favicon2/dist/index.js";
var config = {
  plugins: [
    ViteFaviconsPlugin("./static/favicon.svg"),
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
var vite_config_default = config;
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvb2RpbGYvRG9jdW1lbnRzL0NvZGUvY2hlc3NhZ29uL3NpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9vZGlsZi9Eb2N1bWVudHMvQ29kZS9jaGVzc2Fnb24vc2l0ZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvb2RpbGYvRG9jdW1lbnRzL0NvZGUvY2hlc3NhZ29uL3NpdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tIFwiQHN2ZWx0ZWpzL2tpdC92aXRlXCI7XG5pbXBvcnQgdG9wTGV2ZWxBd2FpdCBmcm9tIFwidml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0XCI7XG5pbXBvcnQgd2FzbSBmcm9tIFwidml0ZS1wbHVnaW4td2FzbVwiO1xuaW1wb3J0IHsgVml0ZUZhdmljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWZhdmljb24yXCI7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cbmNvbnN0IGNvbmZpZyA9IHtcbiAgcGx1Z2luczogW1xuICAgIFZpdGVGYXZpY29uc1BsdWdpbihcIi4vc3RhdGljL2Zhdmljb24uc3ZnXCIpLFxuICAgIHRvcExldmVsQXdhaXQoKSxcbiAgICB3YXNtKCksXG4gICAgc3ZlbHRla2l0KCksXG4gIF0sXG5cbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbXCIuLy53YXNtLWVuZ2luZVwiXSxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLGlCQUFpQjtBQUMxVSxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFDakIsU0FBUywwQkFBMEI7QUFHbkMsSUFBTSxTQUFTO0FBQUEsRUFDYixTQUFTO0FBQUEsSUFDUCxtQkFBbUIsc0JBQXNCO0FBQUEsSUFDekMsY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBLElBQ0wsVUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLE9BQU8sQ0FBQyxnQkFBZ0I7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
