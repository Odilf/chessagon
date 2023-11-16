import { join } from "path";
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { scrollbarGutter } from "tailwind-scrollbar-utilities";

const config = {
  darkMode: "media",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}",
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    skeleton({
      themes: {
        preset: [
          { name: "vintage", enhancements: true },
          { name: "wintry", enhancements: true },
        ],
      },
    }),
    scrollbarGutter(),
  ],
} satisfies Config;

export default config;
